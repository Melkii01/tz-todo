import {Injectable} from '@angular/core';
import {Todo} from "../types/todo";

enum ServiceNamesEnum {
  todosList = 'todosList'
}

@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  /**
   * Запрашивает список todo
   */
  getTodosList(): Todo[] | [] {
    return JSON.parse(window.localStorage.getItem(ServiceNamesEnum.todosList) || '[]');
  }

  /**
   * Отправляем новый отредактированный список
   * @param todos список
   */
  setTodosList(todos: Todo[]): void {
    window.localStorage.setItem(ServiceNamesEnum.todosList, JSON.stringify(todos));
  }
}
