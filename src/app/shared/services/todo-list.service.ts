import {Injectable, OnInit} from '@angular/core';
import {Todo} from "../types/todo";
import {Subject} from "rxjs";
import {FilterNames} from "../types/filter-names";

enum ServiceNamesEnum {
  todosList = 'todosList'
}

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  todos: Todo[] = [];
  showedTodos: Todo[] = [];
  showedTodos$: Subject<Todo[]> = new Subject<Todo[]>();

  constructor() {
    // Получаем ранние todo
    this.todos = JSON.parse(window.localStorage.getItem(ServiceNamesEnum.todosList) || '[]');
    this.showedTodos = this.todos;
    this.showedTodos$.next(this.todos);
  }

  /**
   * Возвращает список todo
   */
  getTodosList() {
    return this.todos;
  }

  /**
   * Возвращает показываемый список todo
   */
  getShowedTodosList() {
    return this.showedTodos;
  }

  /**
   * Показывает отфильтрованный список todo
   * @param filter параметр фильтрации из url
   */
  showedTodosWithFilter(filter: string) {
    if (filter === FilterNames.active) {
      this.showedTodos = this.todos.filter((todo: Todo) => !todo.status);
    } else if (filter === FilterNames.completed) {
      this.showedTodos = this.todos.filter((todo: Todo) => todo.status);
    } else {
      this.showedTodos = this.todos;
    }

    this.showedTodos$.next(this.showedTodos);
  }

  /**
   * Добавляет новый todo в список
   * @param newTodoName название новой todo
   */
  addTodo(newTodoName: string) {
    let lastId: number = this.todos[this.todos.length - 1]?.id;
    this.todos.push({title: newTodoName, status: false, id: lastId ? lastId + 1 : 1});

    this.setTodosList();
  }

  /**
   * Отмечает о выполненности todo или убирает метку
   * @param id идентификатор todo
   */
  toggleCheckedTodo(id: number): void {
    this.todos.find((todo: Todo): void => {
      if (Number(todo.id) === Number(id)) {
        todo.status = !todo.status;
      }
    });

    this.setTodosList();
  }

  /**
   * Отмечает выполненными все todo или убирает метки
   */
  checkedAllTodo() {
    if (this.todos.some((todo: Todo) => !todo.status)) {
      // Если не выделена хоть одна, выделяем все
      this.todos.map((todo: Todo) => todo.status = true);
    } else if (this.todos.every((todo: Todo) => todo.status)) {
      // Если выделены все, убираем отметки
      this.todos.map((todo: Todo) => todo.status = false);
    } else if (this.todos.every((todo: Todo) => !todo.status)) {
      // Если нет отметок, выделяем все
      this.todos.map((todo: Todo) => todo.status = true);
    }

    this.setTodosList();
  }


  /**
   * Удаляет todo из списка
   * @param id идентификатор todo
   */
  removeTodo(id: number): void {
    this.todos = this.todos.filter((todo: Todo): boolean => todo.id !== id);
    this.setTodosList();
  }

  /**
   * Убирает из списка завершенные todo
   */
  clearedCompleted() {
    this.todos = this.todos.filter((todo: Todo): boolean => !todo.status);
    this.setTodosList();
  }

  /**
   * Редактироует todo
   */
  editTodo(event: Todo) {
    this.todos.find((todo: Todo): void => {
      if (Number(todo.id) === Number(event.id)) {
        todo.title = event.title;
      }
    });

    this.setTodosList();
  }

  /**
   * Отправляем новый отредактированный список
   */
  setTodosList(): void {
    window.localStorage.setItem(ServiceNamesEnum.todosList, JSON.stringify(this.todos));
    this.showedTodos = this.todos;
    this.showedTodos$.next(this.showedTodos);
  }
}
