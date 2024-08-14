import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {TodoType} from "../../types/todo.type";

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.scss']
})
export class TodoListItemComponent {
  @Input() todo: TodoType = {} as TodoType;
  @Output() checkedEvent = new EventEmitter<any>();
  @Output() removeEvent = new EventEmitter<number>();
  todoText: string = '';
  isEdit: boolean = false;
  @Output() editedTodoEvent = new EventEmitter<TodoType>();

  constructor(private elementRef: ElementRef) {
  }

  /**
   * Отправляет действие клика на чекбокс родителю
   * @param event параметры события
   */
  toggleChecked(event: any): void {
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
   * Открывает редактор todo
   * @param event параметры события
   */
  openEdit(event: any): void {
    this.todoText = event.target.innerText;
    this.isEdit = true;
  }

  /**
   * Закрывает редактор todo и отправляет новые значения todo родителю
   * @param event параметры события
   */
  closeEdit(event: any): void {
    this.editedTodoEvent.emit({title: this.todoText, id: event.target.id});
    this.isEdit = false;
  }

  /**
   * Закрывает редактирование вне своего блока
   * @param event параметры события
   */
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    console.log(event)
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isEdit = false;
    }
  }
}
