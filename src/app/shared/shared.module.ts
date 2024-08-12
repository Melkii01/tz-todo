import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {TodoHeaderComponent} from './components/todo-header/todo-header.component';
import {TodoListComponent} from './components/todo-list/todo-list.component';
import {TodoFooterComponent} from './components/todo-footer/todo-footer.component';


@NgModule({
  declarations: [
    TodoHeaderComponent,
    TodoListComponent,
    TodoFooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    TodoHeaderComponent,
    TodoListComponent,
    TodoFooterComponent,
  ]
})
export class SharedModule {
}
