import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {Todo} from "../../types/todo";

@Component({
  selector: 'todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListItemComponent {
  @Input() todo?: Todo;
  todoText: string = '';
  isEdit: boolean = false;
  @Output() checkedTodoEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() removeTodoEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() editedTodoEvent: EventEmitter<Todo> = new EventEmitter<Todo>();

  constructor(private elementRef: ElementRef) {
  }

  /**
   * Отправляет действие клика на чекбокс родителю
   */
  toggleChecked(): void {
    this.checkedTodoEvent.emit(this.todo?.id);
  }

  /**
   * Отправляет действие клика на удаление todo родителю
   */
  removeTodo(): void {
    this.removeTodoEvent.emit(this.todo?.id);
  }

  /**
   * Открывает редактор todo
   */
  openEdit(): void {
    if (this.todo) {
      this.todoText = this.todo.title;
      this.isEdit = true;
    }
  }

  /**
   * Закрывает редактор todo и отправляет новые значения todo родителю
   */
  closeEdit(): void {
    if (this.todo && this.todo.id) {
      this.editedTodoEvent.emit({title: this.todoText, id: this.todo.id, status: this.todo.status});
      this.isEdit = false;
    }
  }

  /**
   * Закрывает редактирование вне своего блока
   * @param event параметры события
   */
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isEdit = false;
    }
  }
}
