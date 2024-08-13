import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {TodoHeaderComponent} from './components/todo-header/todo-header.component';
import {TodoListComponent} from './components/todo-list/todo-list.component';
import {TodoFooterComponent} from './components/todo-footer/todo-footer.component';
import { TodoListItemComponent } from './components/todo-list-item/todo-list-item.component';
import {FormsModule} from "@angular/forms";
import {LayoutComponent} from "./layout/layout.component";


@NgModule({
  declarations: [
    TodoHeaderComponent,
    TodoListComponent,
    TodoFooterComponent,
    TodoListItemComponent,
    LayoutComponent,
  ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
  exports: [
    TodoHeaderComponent,
    TodoListComponent,
    TodoFooterComponent,
    TodoListItemComponent,
    LayoutComponent,
  ]
})
export class SharedModule {
}
