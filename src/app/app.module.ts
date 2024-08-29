import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LibTodoModule} from "lib-todo";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LibTodoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
