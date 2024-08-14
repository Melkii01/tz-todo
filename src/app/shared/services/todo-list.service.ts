import {Injectable} from '@angular/core';
import {TodoType} from "../types/todo.type";

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  /**
   * Запрашивает список todo
   */
  getTodosList(): TodoType[] | [] {
    return JSON.parse(window.localStorage.getItem('todosList') || '[]');
  }

  /**
   * Отправляем новый отредактированный список
   * @param todos список
   */
  setTodosList(todos: TodoType[]): void {
    window.localStorage.setItem('todosList', JSON.stringify(todos));
  }
}
