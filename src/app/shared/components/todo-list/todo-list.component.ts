import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from "../../types/todo";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  @Input() showedTodos: Todo[] = [];
  @Input() countAll: number | undefined = 0;
  @Output() checkedTodoEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() removeTodoEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() checkedAllTodoEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() editedTodoEvent: EventEmitter<Todo> = new EventEmitter<Todo>();

  /**
   * Возвращает с новой ссылкой объект todo
   * @param todo данные todo
   */
  returnSpreadTodo(todo: Todo): Todo {
    return { ...todo };
  }

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
    console.log("🚀 ~ file: todo-list.component.ts:46 ~ TodoListComponent ~ checkedAllTodo:")
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
