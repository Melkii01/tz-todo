import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-todo-header',
  templateUrl: './todo-header.component.html',
  styleUrls: ['./todo-header.component.scss']
})
export class TodoHeaderComponent implements OnInit {
  newTodo = ''
  @Output() inputEvent = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  addTodo(): void {
    // console.log(this.newTodo)
    this.inputEvent.emit(this.newTodo);
    this.newTodo = '';
  }
}
