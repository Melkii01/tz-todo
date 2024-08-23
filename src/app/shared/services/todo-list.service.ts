import {Injectable} from '@angular/core';
import {Todo} from "../types/todo";
import {BehaviorSubject, map} from "rxjs";
import {FilterNames} from "../types/filter-names";
import {ServiceNames} from "../types/service-names";

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  todos$: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>(JSON.parse(window.localStorage.getItem(ServiceNames.todosList) || '[]'));
  showedTodos$: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>(JSON.parse(window.localStorage.getItem(ServiceNames.todosList) || '[]'));

  countLeft$ = this.todos$.pipe(
    map(todoList => todoList.filter(e => !e.status).length)
  );
  checkedAtLeastOne$ = this.todos$.pipe(
    map(todoList => todoList.some(e => e.status))
  );

  /**
   * Показывает отфильтрованный показываемый список todo
   * @param filterParam параметр фильтрации из url
   */
  showedTodosWithFilter(filterParam: string): void {
    if (filterParam === FilterNames.active || filterParam === FilterNames.completed) {
      this.showedTodos$.next(this.todos$.getValue().filter((todo: Todo): boolean => !todo.status === (filterParam === FilterNames.active)));
    } else {
      this.showedTodos$.next(this.todos$.getValue());
    }
  }

  // /**
  //  * Показывает количество незавершенных todo и показывает хотя бы один завершенный todo
  //  */
  // completedCheckListCount(): void {
  //   let quantity: number = 0;
  //   let checked: boolean = false;

  //   this.todos$.getValue().forEach((todo: Todo): void => {
  //     if (!todo.status) {
  //       quantity++;
  //     } else if (todo.status) {
  //       checked = true;
  //     }
  //   });

  //   this.countLeft$.next(quantity);
  //   this.checkedAtLeastOne$.next(checked);
  // }

  /**
   * Отправляет новый отредактированный список на сервер и на подписки
   * @param newTodos новый список todo
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
    this.setNewTodosList([...oldTodos, {
      title: newTodoName,
      status: false,
      id: Date.now()
    }]);
  }

  /**
   * Отмечает о выполненности todo или убирает отметку
   * @param id идентификатор todo
   */
  toggleCheckedTodo(id: number): void {
    const todos: Todo[] = this.todos$.getValue();

    todos.find((todo: Todo): void => {
      if (todo.id === id) {
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

    // В активном фильтре отмечаем все, в завершенном фильтре убираем отметки
    if (filterParam === FilterNames.active || filterParam === FilterNames.completed) {
      todos.map((todo: Todo): boolean => todo.status = filterParam === FilterNames.active);
    } else {

      // Если не выделена хоть одна, выделяем все
      if (todos.some((todo: Todo) => !todo.status)) {
        todos.map((todo: Todo): boolean => todo.status = true);

        // Если выделены все, убираем отметки, если нет отметок, выделяем все
      } else {
        todos.map((todo: Todo): boolean => todo.status = todos.every((todo: Todo) => !todo.status));
      }
    }

    this.setNewTodosList(todos);
  }


  /**
   * Удаляет todo из списка
   * @param id идентификатор todo
   */
  removeTodo(id: number): void {
    const todos: Todo[] = this.todos$.getValue().filter((todo: Todo): boolean => todo.id !== id);

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
      if (todo.id === event.id) {
        todo.title = event.title;
      }
    });

    this.setNewTodosList(todos);
  }
}
