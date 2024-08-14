import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TodoType} from "../../types/todo.type";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {
  @Input() todos: TodoType[] = [];
  @Output() checkedEvent = new EventEmitter<Event>();
  @Output() removeEvent = new EventEmitter<number>();
  @Input() countAll = 0;
  @Output() checkedAllTodosEvent = new EventEmitter<any>();
  @Output() editedTodoEvent = new EventEmitter<TodoType>();

  /**
   * Отправляет отметку todo родителю
   * @param event параметры события
   */
  toggleChecked(event: Event): void {
    this.checkedEvent.emit(event);
  }

  /**
   * Отправляет действие клика на удаление todo родителю
   * @param id идентификатор todo
   */
  removeTodo(id: number): void {
    this.removeEvent.emit(id);
  }

  /**
   * Отправляет все отметки todos родителю
   * @param event параметры события
   */
  checkedAllTodos(event: any): void {
    this.checkedAllTodosEvent.emit(event);
  }

  /**
   *Отправляет новые значения todo родителю
   * @param event параметры события
   */
  editedTodo(event: TodoType): void {
    this.editedTodoEvent.emit(event);
  }
}
