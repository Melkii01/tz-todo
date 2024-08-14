import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-todo-header',
  templateUrl: './todo-header.component.html',
  styleUrls: ['./todo-header.component.scss']
})
export class TodoHeaderComponent {
  newTodo: string = ''
  @Output() inputEvent = new EventEmitter<string>();

  addTodo(): void {
    this.inputEvent.emit(this.newTodo);
    this.newTodo = '';
  }
}
