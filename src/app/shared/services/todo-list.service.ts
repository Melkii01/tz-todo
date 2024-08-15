import {Injectable} from '@angular/core';
import {TodoType} from "../types/todo.type";

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
  getTodosList(): TodoType[] | [] {
    return JSON.parse(window.localStorage.getItem(ServiceNamesEnum.todosList) || '[]');
  }

  /**
   * Отправляем новый отредактированный список
   * @param todos список
   */
  setTodosList(todos: TodoType[]): void {
    window.localStorage.setItem(ServiceNamesEnum.todosList, JSON.stringify(todos));
  }
}
