import {Component, Input, OnInit} from '@angular/core';
import {TodoType} from "../../types/todo.type";

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.scss']
})
export class TodoListItemComponent implements OnInit {
  @Input() todo: TodoType = {} as TodoType;

  constructor() {
  }

  ngOnInit(): void {
  }

}
