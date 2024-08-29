import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'todo-header',
  templateUrl: './todo-header.component.html',
  styleUrls: ['./todo-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoHeaderComponent {
  newTodo: string = ''
  @Output() inputEvent: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Добавляет новый todo в список todo
   */
  addTodo(): void {
    this.inputEvent.emit(this.newTodo);
    this.newTodo = '';
  }
}
