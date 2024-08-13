import {Component, OnDestroy, OnInit} from '@angular/core';
import {TodoType} from "../../shared/types/todo.type";
import {TodoListService} from "../../shared/services/todo-list.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss']
})
export class TodoAppComponent implements OnInit, OnDestroy {
  todos: TodoType[] = [];
  showedTodos: TodoType[] = [];
  activeQueryParams: { filter: string } = {filter: ''};
  private subs: Subscription = new Subscription();

  constructor(private todosListService: TodoListService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.showTodoList();
  }

  /**
   * // Запрашиваем лист todo согласно значения фильтра
   */
  showTodoList() {
    this.subs.add(this.activatedRoute.queryParams.subscribe((params: Params): void => {
      this.todos = this.todosListService.getTodosList();
      this.showedTodos = this.todos;

      if (params['filter'] === 'all') {
        this.showedTodos = this.todosListService.getTodosList();
      } else if (params['filter'] === 'active') {
        this.showedTodos = this.todos.filter((todo: TodoType) => !todo.status);
      } else if (params['filter'] === 'completed') {
        this.showedTodos = this.todos.filter((todo: TodoType) => todo.status);
      }
      this.activeQueryParams.filter = params['filter'];

    }));
  }

  /**
   * Добавить todo
   * @param newTodo название новой todo
   */
  addTodo(newTodo: string): void {
    if (newTodo) {


      let lastId: number = this.todos[this.todos.length - 1]?.id;

      this.todos.push({title: newTodo, status: false, id: lastId ? lastId + 1 : 1});

      if (this.activeQueryParams.filter === 'active') {
        this.showedTodos = this.todos.filter((todo: TodoType) => !todo.status);
      } else if (this.activeQueryParams.filter === 'completed') {
        this.showedTodos = this.todos.filter((todo: TodoType) => todo.status);
      } else {
        this.showedTodos = this.todos;
      }

      this.todosListService.toggleTodos((this.todos));

    }
  }

  /**
   * Отметить о выполненности todo или убрать метку
   * @param event параметры события
   */
  toggleStatusTodo(event: any): void {
    this.todos.find((todo: TodoType): void => {
      if (Number(todo.id) === Number(event.target.id)) {
        todo.status = event.target.checked;
      }
    });

    if (this.activeQueryParams.filter === 'active') {
      this.showedTodos = this.todos.filter((todo: TodoType) => !todo.status);
    } else if (this.activeQueryParams.filter === 'completed') {
      this.showedTodos = this.todos.filter((todo: TodoType) => todo.status);
    } else {
      this.showedTodos = this.todos;
    }

    this.todosListService.toggleTodos((this.todos));
  }

  /**
   * Удаление todo
   * @param id идентификатор todo
   */
  removeTodo(id: number): void {
    this.todos = this.todos.filter((todo: TodoType): boolean => todo.id !== id);

    if (this.activeQueryParams.filter === 'active') {
      this.showedTodos = this.todos.filter((todo: TodoType) => !todo.status);
    } else if (this.activeQueryParams.filter === 'completed') {
      this.showedTodos = this.todos.filter((todo: TodoType) => todo.status);
    } else {
      this.showedTodos = this.todos;
    }

    this.todosListService.toggleTodos((this.todos));
  }

  /**
   *
   */
  clearedCompleted() {
    this.todos = this.todos.filter((todo: TodoType): boolean => !todo.status);

    if (this.activeQueryParams.filter === 'active') {
      this.showedTodos = this.todos.filter((todo: TodoType) => !todo.status);
    } else if (this.activeQueryParams.filter === 'completed') {
      this.showedTodos = this.todos.filter((todo: TodoType) => todo.status);
    } else {
      this.showedTodos = this.todos;
    }

    this.todosListService.toggleTodos((this.todos));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
