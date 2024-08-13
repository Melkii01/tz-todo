import { Injectable } from '@angular/core';
import {TodoType} from "../types/todo.type";

@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  constructor() { }

  getTodosList() {
    return JSON.parse(window.localStorage.getItem('todosList') || '[]');
  }

  toggleTodos(todos: TodoType[]) {
    window.localStorage.setItem('todosList', JSON.stringify(todos));
  }
}
