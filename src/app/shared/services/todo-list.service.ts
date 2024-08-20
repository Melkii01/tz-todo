import {Injectable} from '@angular/core';
import {Todo} from "../types/todo";
import {BehaviorSubject} from "rxjs";
import {FilterNames} from "../types/filter-names";
import {ServiceNames} from "../types/service-names";

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  todos$: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>(JSON.parse(window.localStorage.getItem(ServiceNames.todosList) || '[]'));
  showedTodos$: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>(JSON.parse(window.localStorage.getItem(ServiceNames.todosList) || '[]'));

  countLeft$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  checkedAtLeastOne$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Показывает отфильтрованный показываемый список todo
   * @param filterParam параметр фильтрации из url
   */
  showedTodosWithFilter(filterParam: string): void {
    if (filterParam === FilterNames.active) {
      this.showedTodos$.next(this.todos$.getValue().filter((todo: Todo) => !todo.status))
    } else if (filterParam === FilterNames.completed) {
      this.showedTodos$.next(this.todos$.getValue().filter((todo: Todo) => todo.status));
    } else {
      this.showedTodos$.next(this.todos$.getValue());
    }

    console.log(this.todos$, 'Подписки не должны увеличиваться');
    console.log(this.showedTodos$, 'Подписки не должны увеличиваться');
    console.log(this.countLeft$, 'Подписки не должны увеличиваться');
    console.log(this.checkedAtLeastOne$, 'Подписки не должны увеличиваться');
  }

  /**
   * Показывает количество незавершенных todo и показывает хотя бы один завершенный todo
   */
  completedCheckListCount(): void {
    let quantity: number = 0;
    let checked: boolean = false;

    this.todos$.getValue().forEach((todo: Todo): void => {
      if (!todo.status) {
        quantity++;
      } else if (todo.status) {
        checked = true;
      }
    });

    this.countLeft$.next(quantity);
    this.checkedAtLeastOne$.next(checked);
  }

  /**
   * Отправляет новый отредактированный список на сервер и на подписки
   */
  setNewTodosList(newTodos: Todo[]): void {
    window.localStorage.setItem(ServiceNames.todosList, JSON.stringify(newTodos));
    this.todos$.next(newTodos);
    this.showedTodos$.next(newTodos);
  }

  /**
   * Добавляет новый todo в список todo
   * @param newTodoName название новой todo
   */
  addTodo(newTodoName: string): void {
    const oldTodos: Todo[] = this.todos$.getValue();
    const lastId: number | undefined = oldTodos[oldTodos.length - 1]?.id;
    this.setNewTodosList([...oldTodos, {
      title: newTodoName,
      status: false,
      id: lastId ? lastId + 1 : 1
    }]);
  }

  /**
   * Отмечает о выполненности todo или убирает отметку
   * @param id идентификатор todo
   */
  toggleCheckedTodo(id: number): void {
    const todos: Todo[] = this.todos$.getValue();

    todos.find((todo: Todo): void => {
      if (Number(todo.id) === Number(id)) {
        todo.status = !todo.status;
      }
    });

    this.setNewTodosList(todos);
  }

  /**
   * Отмечает выполненными все todo или убирает у всех отметки
   * @param filterParam параметр фильтрации из url
   */
  checkedAllTodo(filterParam: string): void {
    let todos: Todo[] = this.todos$.getValue();

    // В активном фильтре отмечаем все
    if (filterParam === FilterNames.active) {
      todos.map((todo: Todo): boolean => todo.status = true);

      // В завершенном фильтре убираем отметки
    } else if (filterParam === FilterNames.completed) {
      todos.map((todo: Todo): boolean => todo.status = false);

    } else {
      // Если не выделена хоть одна, выделяем все
      if (todos.some((todo: Todo) => !todo.status)) {
        todos.map((todo: Todo): boolean => todo.status = true);

        // Если выделены все, убираем отметки
      } else if (todos.every((todo: Todo) => todo.status)) {
        todos.map((todo: Todo): boolean => todo.status = false);

        // Если нет отметок, выделяем все
      } else if (todos.every((todo: Todo) => !todo.status)) {
        todos.map((todo: Todo): boolean => todo.status = true);
      }
    }


    this.setNewTodosList(todos);
  }


  /**
   * Удаляет todo из списка
   * @param id идентификатор todo
   */
  removeTodo(id: number): void {
    const todos: Todo[] = this.todos$.getValue().filter((todo: Todo): boolean => Number(todo.id) !== Number(id));

    this.setNewTodosList(todos);
  }

  /**
   * Убирает из списка завершенные todo
   */
  clearedCompleted(): void {
    const todos: Todo[] = this.todos$.getValue().filter((todo: Todo): boolean => !todo.status);

    this.setNewTodosList(todos);
  }

  /**
   * Редактироует todo
   */
  editTodo(event: Todo): void {
    const todos: Todo[] = this.todos$.getValue();

    todos.find((todo: Todo): void => {
      if (Number(todo.id) === Number(event.id)) {
        todo.title = event.title;
      }
    });

    this.setNewTodosList(todos);
  }
}
