import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TodoType} from "../../types/todo.type";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {
  @Input() todos: TodoType[] = [];
  @Output() checkedTodoEvent = new EventEmitter<number>();
  @Output() removeTodoEvent = new EventEmitter<number>();
  @Input() countAll = 0;
  @Output() checkedAllTodoEvent = new EventEmitter<string>();
  @Output() editedTodoEvent = new EventEmitter<TodoType>();

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
  editedTodo(event: TodoType): void {
    this.editedTodoEvent.emit(event);
  }
}
