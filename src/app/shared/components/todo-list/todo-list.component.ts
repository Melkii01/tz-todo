import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TodoType} from "../../types/todo.type";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  @Input() todos: TodoType[] = [];
  @Output() checkedEvent = new EventEmitter<Event>();
  @Output() removeEvent = new EventEmitter<number>();
  @Input() countAll = 0;
  @Output() checkedAllTodosEvent = new EventEmitter<any>();
  @Output() editedTodoEvent = new EventEmitter<{ title: string, id: number }>();

  constructor() {
  }

  ngOnInit(): void {
  }

  addTodo(event: Event) {
    this.checkedEvent.emit(event);
  }

  removeTodo(id: number) {
    this.removeEvent.emit(id);
  }

  checkedAllTodos(event: any) {
    this.checkedAllTodosEvent.emit(event);
  }

  editedTodo(event: { title: string, id: number }) {
    this.editedTodoEvent.emit(event);
  }
}
