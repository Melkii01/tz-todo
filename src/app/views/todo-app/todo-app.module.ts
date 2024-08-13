import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoAppRoutingModule } from './todo-app-routing.module';
import { TodoAppComponent } from './todo-app.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    TodoAppComponent
  ],
    imports: [
        CommonModule,
        TodoAppRoutingModule,
        SharedModule
    ]
})
export class TodoAppModule { }
