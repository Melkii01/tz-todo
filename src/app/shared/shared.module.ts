import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {TodoHeaderComponent} from './components/todo-header/todo-header.component';
import {TodoListComponent} from './components/todo-list/todo-list.component';
import {TodoFooterComponent} from './components/todo-footer/todo-footer.component';
import { TodoListItemComponent } from './components/todo-list-item/todo-list-item.component';


@NgModule({
  declarations: [
    TodoHeaderComponent,
    TodoListComponent,
    TodoFooterComponent,
    TodoListItemComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    TodoHeaderComponent,
    TodoListComponent,
    TodoFooterComponent,
    TodoListItemComponent
  ]
})
export class SharedModule {
}
