import {Component, OnDestroy, OnInit} from '@angular/core';
import {Todo} from "../../shared/types/todo";
import {TodoListService} from "../../shared/services/todo-list.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription, tap} from "rxjs";
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
    // Запрашиваем значения списка и показываемого списка todo
    this.todos = this.todosListService.getTodosList();
    this.showedTodos = this.todosListService.getShowedTodosList();

    // Следим за показываемыми todo
    this.subs.add(this.todosListService.showedTodos$.subscribe((todos: Todo[]) => {
      this.showedTodos = todos;
    }));
    this.getTodoList();
  }

  /**
   * // Запрашиваем query параметры согласно значению фильтра
   */
  getTodoList(): void {
    this.subs.add(this.activatedRoute.queryParams.pipe(
      tap(((params: Params) => {
          this.activeQueryParams.filter = params[FilterNames.filter];
          this.showedTodosWithFilter();
        }),
      )).subscribe())
  }

  /**
   * Показывает отфильрованный показываемый список todo
   */
  showedTodosWithFilter() {
    this.todosListService.showedTodosWithFilter(this.activeQueryParams.filter);

    // Читаем количество незавершенных todo и ищем хотя бы один статус true
    let quantity: number = 0;
    let checked: boolean = false;
    this.todosListService.getTodosList().forEach((todo) => {
      if (!todo.status) {
        quantity++;
      } else if (todo.status) {
        checked = true;
      }
    });
    this.countLeft = quantity;
    this.checkedAtLeastOne = checked;
  }

  /**
   * Добавляет новый todo в список
   * @param newTodoName название новой todo
   */
  addTodo(newTodoName: string): void {
    if (newTodoName) {
      this.todosListService.addTodo(newTodoName);
      this.showedTodosWithFilter();
    }
  }

  /**
   * Отмечает о выполненности todo или убирает метку
   * @param id идентификатор todo
   */
  toggleCheckedTodo(id: number): void {
    this.todosListService.toggleCheckedTodo(id);
    this.showedTodosWithFilter();
  }

  /**
   * Отмечает выполненными все todo или убирает метки
   */
  checkedAllTodo() {
    this.todosListService.checkedAllTodo();
    this.showedTodosWithFilter();
  }

  /**
   * Удаляет todo из списка
   * @param id идентификатор todo
   */
  removeTodo(id: number): void {
    this.todosListService.removeTodo(id);
    this.showedTodosWithFilter();
  }

  /**
   * Убирает из списка завершенные todo
   */
  clearedCompleted() {
    this.todosListService.clearedCompleted();
    this.showedTodosWithFilter();
  }

  /**
   * Редактироует todo
   */
  editTodo(event: Todo) {
    this.todosListService.editTodo(event);
    this.showedTodosWithFilter();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
