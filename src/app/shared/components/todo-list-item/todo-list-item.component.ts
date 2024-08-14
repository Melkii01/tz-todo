import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TodoType} from "../../types/todo.type";

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.scss']
})
export class TodoListItemComponent implements OnInit {
  @Input() todo: TodoType = {} as TodoType;
  @Output() checkedEvent = new EventEmitter<Event>();
  @Output() removeEvent = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleChecked(event: Event): void {
    // console.log(event.target.checked)
    // console.log(event.target.nextSibling.innerText)
    this.checkedEvent.emit(event);
  }

  removeTodo(id: number): void {
    this.removeEvent.emit(id);
  }
}
