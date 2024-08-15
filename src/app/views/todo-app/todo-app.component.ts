import {Component, OnDestroy, OnInit} from '@angular/core';
import {Todo} from "../../shared/types/todo";
import {TodoListService} from "../../shared/services/todo-list.service";
import {ActivatedRoute, Params} from "@angular/router";
import {concatMap, Subscription} from "rxjs";
import {FilterNames} from "../../shared/types/filter-names";

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss']
})
export class TodoAppComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  showedTodos: Todo[] = [];
  activeQueryParams: { filter: string } = {filter: ''};
  private subs: Subscription = new Subscription();
  countLeft: number = 0;
  checkedAtLeastOne: boolean = false;

  constructor(private todosListService: TodoListService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getTodoList();
  }

  /**
   * // Запрашивает список todo согласно значению фильтра
   */
  getTodoList():void {
    this.todos = this.todosListService.getTodosList();
    this.subs.add(this.activatedRoute.queryParams.pipe(
      concatMap((params: Params) => {
        this.activeQueryParams.filter = params[FilterNames.filter];
        return [params[FilterNames.filter]];
      }),
    ).subscribe({
        next: ():void => {
          this.showedTodosWithFilter();
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
  showedTodosWithFilter() {
    if (this.activeQueryParams.filter === FilterNames.active) {
      this.showedTodos = this.todos.filter((todo: Todo) => !todo.status);
    } else if (this.activeQueryParams.filter === FilterNames.completed) {
      this.showedTodos = this.todos.filter((todo: Todo) => todo.status);
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

      this.showedTodosWithFilter();
    }
  }

  /**
   * Отмечает о выполненности todo или убрать метку
   * @param id идентификатор todo
   */
  toggleCheckedTodo(id: number): void {
    this.todos.find((todo: Todo): void => {
      if (Number(todo.id) === Number(id)) {
        todo.status = !todo.status;
      }
    });

    this.showedTodosWithFilter();
  }

  /**
   * Отмечает выполненными все todo или убрать отметку
   */
  checkedAllTodo() {
    if (this.todos.some((todo: Todo) => !todo.status)) {
      // Если не выделена хоть одна, выделяем все
      this.todos.map((todo: Todo) => todo.status = true);
    } else if (this.todos.every((todo: Todo) => todo.status)) {
      // Если выделены все, убираем отметки
      this.todos.map((todo: Todo) => todo.status = false);
    } else if (this.todos.every((todo: Todo) => !todo.status)) {
      // Если нет отметок, выделяем все
      this.todos.map((todo: Todo) => todo.status = true);
    }

    this.showedTodosWithFilter();
  }

  /**
   * Удаляет todo из списка
   * @param id идентификатор todo
   */
  removeTodo(id: number): void {
    this.todos = this.todos.filter((todo: Todo): boolean => todo.id !== id);
    this.showedTodosWithFilter();
  }

  /**
   * Убирает из списка завершенные todo
   */
  clearedCompleted() {
    this.todos = this.todos.filter((todo: Todo): boolean => !todo.status);
    this.showedTodosWithFilter();
  }

  /**
   * Редактироует todo
   */
  editTodo(event: {title:string,id:number}) {
    this.todos.find((todo: Todo): void => {
      if (Number(todo.id) === Number(event.id)) {
        todo.title = event.title;
      }
    });

    this.showedTodosWithFilter();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
