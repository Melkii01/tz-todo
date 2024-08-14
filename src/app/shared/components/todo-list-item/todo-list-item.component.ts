import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {TodoType} from "../../types/todo.type";
import {Event} from "@angular/router";

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.scss']
})
export class TodoListItemComponent implements OnInit {
  @Input() todo: TodoType = {} as TodoType;
  @Output() checkedEvent = new EventEmitter<any>();
  @Output() removeEvent = new EventEmitter<number>();
  todoText: string = '';
  isEdit = false;
  @Output() editedTodoEvent = new EventEmitter<{title:string,id:number}>();

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleChecked(event: any): void {
    this.checkedEvent.emit(event);
  }

  removeTodo(id: number): void {
    this.removeEvent.emit(id);
  }

  openEdit(event: any): void {
    this.todoText = event.target.innerText;
    this.isEdit = true;
  }

  closeEdit(event: any): void {
    this.editedTodoEvent.emit({title:this.todoText,id:event.target.id});
    this.isEdit = false;
    console.log(this.todoText)

  }
}
