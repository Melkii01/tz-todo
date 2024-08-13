import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TodoType} from "../../types/todo.type";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  @Input() todos: TodoType[] = [];
  @Output() checkedEvent = new EventEmitter<any>();
  @Output() removeEvent = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  addTodo(event: any) {
    this.checkedEvent.emit(event);
  }

  removeTodo(id: number) {
    this.removeEvent.emit(id);
  }
}
