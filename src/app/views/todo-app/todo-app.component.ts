import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {TodoType} from "../../shared/types/todo.type";
import {TodoListService} from "../../shared/services/todo-list.service";
import {ActivatedRoute, Params} from "@angular/router";
import {concatMap, Subscription} from "rxjs";

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
  countLeft: number = 0;

  constructor(private todosListService: TodoListService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.showTodoList();
  }

  /**
   * // Запрашиваем лист todo согласно значению фильтра
   */
  showTodoList() {
    this.todos = this.todosListService.getTodosList();
    this.subs.add(this.activatedRoute.queryParams.pipe(
      concatMap((params: Params) => {
        this.activeQueryParams.filter = params['filter'];
        return [params['filter']];
      }),
    ).subscribe({
        next: (filter) => {
          this.showedTodosFilter();
        },
        error: (err) => {
          throw Error(err);
        },
      },
    ));
  }

  /**
   * Показывает отфильрованный лист todo
   */
  showedTodosFilter() {
    if (this.activeQueryParams.filter === 'active') {
      this.showedTodos = this.todos.filter((todo: TodoType) => !todo.status);
    } else if (this.activeQueryParams.filter === 'completed') {
      this.showedTodos = this.todos.filter((todo: TodoType) => todo.status);
    } else {
      this.showedTodos = this.todos;
    }

    let quantity: number = 0;
    this.todos.forEach((todo) => {
      if (!todo.status) {
        quantity++;
      }
    });
    this.countLeft = quantity;

    this.todosListService.setTodosList((this.todos));
  }

  /**
   * Добавить todo в лист
   * @param newTodo название новой todo
   */
  addTodo(newTodo: string): void {
    if (newTodo) {
      let lastId: number = this.todos[this.todos.length - 1]?.id;
      this.todos.push({title: newTodo, status: false, id: lastId ? lastId + 1 : 1});

      this.showedTodosFilter();
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

    this.showedTodosFilter();
  }

  /**
   * Отметить выполненными все todo или убрать отметку
   * @param event параметры события
   */
  checkedAllTodos(event: any) {
    if (this.todos.some((todo: TodoType) => !todo.status)) {
      // Если не выделена хоть одна, выделяем все
      this.todos.map((todo: TodoType) => todo.status = true);
    } else if (this.todos.every((todo: TodoType) => todo.status)) {
      // Если выделены все, убираем отметки
      this.todos.map((todo: TodoType) => todo.status = false);
    } else if (this.todos.every((todo: TodoType) => !todo.status)) {
      // Если нет отметок, выделяем все
      this.todos.map((todo: TodoType) => todo.status = true);
    }

    this.showedTodosFilter();
  }

  /**
   * Удаление todo из листа
   * @param id идентификатор todo
   */
  removeTodo(id: number): void {
    this.todos = this.todos.filter((todo: TodoType): boolean => todo.id !== id);
    this.showedTodosFilter();
  }

  /**
   * Убирает из листа завершенные todo
   */
  clearedCompleted() {
    this.todos = this.todos.filter((todo: TodoType): boolean => !todo.status);
    this.showedTodosFilter();
  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
