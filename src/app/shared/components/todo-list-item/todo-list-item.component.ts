import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {TodoType} from "../../types/todo.type";

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.scss']
})
export class TodoListItemComponent {
  @Input() todo: TodoType = {} as TodoType;
  @Output() checkedTodoEvent = new EventEmitter<number>();
  @Output() removeTodoEvent = new EventEmitter<number>();
  todoText: string = '';
  isEdit: boolean = false;
  @Output() editedTodoEvent = new EventEmitter<TodoType>();

  constructor(private elementRef: ElementRef) {
  }

  /**
   * Отправляет действие клика на чекбокс родителю
   */
  toggleChecked(): void {
    this.checkedTodoEvent.emit(this.todo.id);
  }

  /**
   * Отправляет действие клика на удаление todo родителю
   */
  removeTodo(): void {
    this.removeTodoEvent.emit(this.todo.id);
  }

  /**
   * Открывает редактор todo
   */
  openEdit(): void {
    this.todoText = this.todo.title;
    this.isEdit = true;
  }

  /**
   * Закрывает редактор todo и отправляет новые значения todo родителю
   */
  closeEdit(): void {
    this.editedTodoEvent.emit({title: this.todoText, id: this.todo.id, status: this.todo.status});
    this.isEdit = false;
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
