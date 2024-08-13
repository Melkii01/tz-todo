import {Component, OnInit} from '@angular/core';
import {TodoType} from "../../shared/types/todo.type";
import {TodoListService} from "../../shared/services/todo-list.service";

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss']
})
export class TodoAppComponent implements OnInit {
  todos: TodoType[] = [];

  constructor(private todosListService: TodoListService) {
  }

  ngOnInit() {
    // Запрашиваем лист todo
    this.todos = this.todosListService.getTodosList();
  }

  /**
   * Добавить todo
   * @param newTodo название новой todo
   */
  addTodo(newTodo: string): void {
    let lastId: number = this.todos[this.todos.length - 1]?.id;

    this.todos.push({title: newTodo, status: false, id: lastId ? lastId + 1 : 1});
    this.todosListService.toggleTodos((this.todos));
  }

  /**
   * Отметить о выполненности todo или убрать метку
   * @param event параметры события
   */
  toggleStatusTodo(event: any): void {
    this.todos.find((todo:TodoType):void => {
      if (Number(todo.id) === Number(event.target.id)) {
        todo.status = event.target.checked;
      }
    })
    this.todosListService.toggleTodos((this.todos));
  }

  /**
   * Удаление todo
   * @param id идентификатор todo
   */
  removeTodo(id: number): void {
    this.todos = this.todos.filter((todo: TodoType): boolean => todo.id !== id);
    this.todosListService.toggleTodos((this.todos));
  }

  /**
   *
   */
  cleareCompleted(){
    this.todos = this.todos.filter((todo: TodoType): boolean => todo.status !== true);
    this.todosListService.toggleTodos((this.todos));
  }
}
