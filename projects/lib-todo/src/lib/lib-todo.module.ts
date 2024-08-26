import { NgModule } from '@angular/core';
import { LibTodoComponent } from './lib-todo.component';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TodoAppComponent} from "./todo/components/todo-app.component";
import {TodoHeaderComponent} from "./todo/components/todo-header/todo-header.component";
import {TodoFooterComponent} from "./todo/components/todo-footer/todo-footer.component";
import {TodoListComponent} from "./todo/components/todo-list/todo-list.component";
import {TodoListItemComponent} from "./todo/components/todo-list-item/todo-list-item.component";



@NgModule({
  declarations: [
    LibTodoComponent,
    TodoAppComponent,
    TodoHeaderComponent,
    TodoFooterComponent,
    TodoListComponent,
    TodoListItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    LibTodoComponent
  ]
})
export class LibTodoModule { }
