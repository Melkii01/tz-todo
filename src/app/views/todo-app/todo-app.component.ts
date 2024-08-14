import {Component, OnDestroy, OnInit} from '@angular/core';
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
  checkedAtLeastOne: boolean = false;

  constructor(private todosListService: TodoListService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.showTodoList();
  }

  /**
   * // Запрашивает список todo согласно значению фильтра
   */
  showTodoList():void {
    this.todos = this.todosListService.getTodosList();
    this.subs.add(this.activatedRoute.queryParams.pipe(
      concatMap((params: Params) => {
        this.activeQueryParams.filter = params['filter'];
        return [params['filter']];
      }),
    ).subscribe({
        next: ():void => {
          this.showedTodosFilter();
        },
        error: (err):void => {
          throw Error(err);
        },
      },
    ));
  }

  /**
   * Показывает отфильрованный список todo
   */
  showedTodosFilter() {
    if (this.activeQueryParams.filter === 'active') {
      this.showedTodos = this.todos.filter((todo: TodoType) => !todo.status);
    } else if (this.activeQueryParams.filter === 'completed') {
      this.showedTodos = this.todos.filter((todo: TodoType) => todo.status);
    } else {
      this.showedTodos = this.todos;
    }

    // Читаем количество незавершенных todo и ищем хотя бы один статус true
    let quantity: number = 0;
    let checked: boolean = false;
    this.todos.forEach((todo) => {
      if (!todo.status) {
        quantity++;
      } else if (todo.status) {
        checked = true;
      }
    });
    this.countLeft = quantity;
    this.checkedAtLeastOne = checked;

    this.todosListService.setTodosList((this.todos));
  }

  /**
   * Добавляет новый todo в список
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
   * Отмечает о выполненности todo или убрать метку
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
   * Отмечает выполненными все todo или убрать отметку
   */
  checkedAllTodos() {
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
   * Удаляет todo из списка
   * @param id идентификатор todo
   */
  removeTodo(id: number): void {
    this.todos = this.todos.filter((todo: TodoType): boolean => todo.id !== id);
    this.showedTodosFilter();
  }

  /**
   * Убирает из списка завершенные todo
   */
  clearedCompleted() {
    this.todos = this.todos.filter((todo: TodoType): boolean => !todo.status);
    this.showedTodosFilter();
  }

  /**
   * Редактироует todo
   */
  editTodo(event: {title:string,id:number}) {
    this.todos.find((todo: TodoType): void => {
      if (Number(todo.id) === Number(event.id)) {
        todo.title = event.title;
      }
    });

    this.showedTodosFilter();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
