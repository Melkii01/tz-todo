import { Injectable } from '@angular/core';
import { Todo } from "../types/todo";
import { BehaviorSubject, map, Observable } from "rxjs";
import { FilterNames } from "../types/filter-names";
import { ServiceNames } from "../types/service-names";

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  todos$: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>(
    JSON.parse(window.localStorage.getItem(ServiceNames.todosList) || '[]'));
  showedTodos$: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>(
    JSON.parse(window.localStorage.getItem(ServiceNames.todosList) || '[]'));

  countLeft$: Observable<number> = this.todos$.pipe(
    map((todos: Todo[]) => todos.filter((todo: Todo) => !todo.status).length)
  );
  checkedAtLeastOne$: Observable<boolean> = this.todos$.pipe(
    map((todos: Todo[]) => todos.some((todo: Todo) => todo.status))
  );

  /**
   * Отправляет новый отредактированный список на сервер и на подписки
   * @param newTodos новый список todo
   * @param filterParam параметр фильтрации из url
   */
  setNewTodosList(newTodos: Todo[], filterParam: string): void {
    window.localStorage.setItem(ServiceNames.todosList, JSON.stringify(newTodos));
    this.todos$.next(newTodos);
    if (filterParam === FilterNames.active || filterParam === FilterNames.completed) {
      this.showedTodos$.next(newTodos.filter((todo: Todo): boolean => !todo.status === (filterParam === FilterNames.active)));
    } else {
      this.showedTodos$.next(newTodos);
    }
  }

  /**
   * Добавляет новый todo в список todo
   * @param newTodoName название новой todo
   * @param filterParam параметр фильтрации из url
   */
  addTodo(newTodoName: string, filterParam: string): void {
    const oldTodos: Todo[] = this.todos$.getValue();
    this.setNewTodosList([...oldTodos, {
      title: newTodoName,
      status: false,
      id: Date.now()
    }],
      filterParam);
  }

  /**
   * Отмечает о выполненности todo или убирает отметку
   * @param id идентификатор todo
   * @param filterParam параметр фильтрации из url
   */
  toggleCheckedTodo(id: number, filterParam: string): void {
    const todos: Todo[] = this.todos$.getValue();

    todos.find((todo: Todo): void => {
      if (todo.id === id) {
        todo.status = !todo.status;
      }
    });

    this.setNewTodosList(todos, filterParam);
  }

  /**
   * Отмечает выполненными все todo или убирает у всех отметки
   * @param filterParam параметр фильтрации из url
   *
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

    console.log("🚀 ~ file: todo-list.service.ts:95 ~ TodoListService ~ todos, filterParam:", todos, filterParam)
    this.setNewTodosList(structuredClone(todos), filterParam);
  }


  /**
   * Удаляет todo из списка
   * @param id идентификатор todo
   * @param filterParam параметр фильтрации из url
   */
  removeTodo(id: number, filterParam: string): void {
    const todos: Todo[] = this.todos$.getValue().filter((todo: Todo): boolean => todo.id !== id);

    this.setNewTodosList(todos, filterParam);
  }

  /**
   * Убирает из списка завершенные todo
   * @param filterParam параметр фильтрации из url
   */
  clearedCompleted(filterParam: string): void {
    const todos: Todo[] = this.todos$.getValue().filter((todo: Todo): boolean => !todo.status);

    this.setNewTodosList(todos, filterParam);
  }

  /**
   * Редактироует todo
   * @param event данные todo
   * @param filterParam параметр фильтрации из url
   */
  editTodo(event: Todo, filterParam: string): void {
    const todos: Todo[] = this.todos$.getValue();

    todos.find((todo: Todo): void => {
      if (todo.id === event.id) {
        todo.title = event.title;
      }
    });

    this.setNewTodosList(todos, filterParam);
  }
}
