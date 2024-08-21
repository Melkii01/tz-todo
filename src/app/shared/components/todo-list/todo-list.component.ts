import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Todo} from "../../types/todo";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Input() countAll: number | undefined = 0;
  @Output() checkedTodoEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() removeTodoEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() checkedAllTodoEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() editedTodoEvent: EventEmitter<Todo> = new EventEmitter<Todo>();

  /**
   * Отправляет отметку todo родителю
   * @param id идентификатор todo
   */
  checkedTodo(id: number): void {
    this.checkedTodoEvent.emit(id);
  }

  /**
   * Отправляет действие клика на удаление todo родителю
   * @param id идентификатор todo
   */
  removeTodo(id: number): void {
    this.removeTodoEvent.emit(id);
  }

  /**
   * Отправляет все отметки todos родителю
   */
  checkedAllTodo(): void {
    this.checkedAllTodoEvent.emit('');
  }

  /**
   *Отправляет новые значения todo родителю
   * @param event параметры события
   */
  editedTodo(event: Todo): void {
    this.editedTodoEvent.emit(event);
  }
}
