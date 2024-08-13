import {Component, Input, OnInit} from '@angular/core';
import {TodoType} from "../../types/todo.type";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  @Input() todos: TodoType[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

}
