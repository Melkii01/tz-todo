import {Component, OnInit} from '@angular/core';
import {TodoType} from "../../shared/types/todo.type";
import {TodoListService} from "../../shared/services/todo-list.service";

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss']
})
export class TodoAppComponent implements OnInit {
  todos: TodoType[] = [];

  constructor(private todosListService: TodoListService) {
  }

  ngOnInit() {
    this.todos = this.todosListService.getTodosList();
  }

  addTodo(newTodo: string): void {
    console.log(newTodo)
    this.todos.push({title: newTodo, status: 'InProgress'});
    this.todosListService.toggleTodos((this.todos));
  }
  // toggleStatusTodo(newStatus: string): void {
  //   console.log(newStatus)
  //   this.todos.push({title: newTodo, status: 'InProgress'});
  //   this.todosListService.toggleTodos((this.todos));
  // }
}
