import {Component, OnDestroy, OnInit} from '@angular/core';
import {Todo} from "../../shared/types/todo";
import {TodoListService} from "../../shared/services/todo-list.service";
import {ActivatedRoute, Params} from "@angular/router";
import {BehaviorSubject, Subject, takeUntil, tap} from "rxjs";
import {FilterNames} from "../../shared/types/filter-names";

@Component({
  selector: 'app-todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss']
})
export class TodoAppComponent implements OnInit, OnDestroy {
  todos$ = this.todosListService.todos$;
  showedTodos$ = this.todosListService.showedTodos$;
  private activeQueryParams: { filter: string } = {filter: ''};
  countLeft$ = new BehaviorSubject<number>(0);
  checkedAtLeastOne$ = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute,
              private todosListService: TodoListService) {
  }

  ngOnInit() {
    // this.todos = this.todosListService.getTodosList();
    // this.todos$ = this.todosListService.todos$;
    // this.showedTodos$ = this.todosListService.showedTodos$;

    // Показываем список показываемого todo
    this.getTodoList();
  }

  /**
   * // Запрашиваем query параметры согласно значению фильтра
   */
  getTodoList(): void {
    this.activatedRoute.queryParams.pipe(
      tap(((params: Params) => {
          this.activeQueryParams.filter = params[FilterNames.filter];
          this.showedTodosWithFilter();
        }),
      ),
      takeUntil(this.destroy$)).subscribe()
  }

  /**
   * Показывает отфильрованный показываемый список todo
   */
  showedTodosWithFilter() {
    this.todosListService.showedTodosWithFilter(this.activeQueryParams.filter);

    // Читаем количество незавершенных todo и ищем хотя бы один статус true
    let quantity: number = 0;
    let checked: boolean = false;
    // this.todosListService.getTodosList().forEach((todo) => {
    //   if (!todo.status) {
    //     quantity++;
    //   } else if (todo.status) {
    //     checked = true;
    //   }
    // });
    this.todos$.pipe(
      tap((todos: Todo[]) => {
        todos.forEach(todo => {
          if (!todo.status) {
                quantity++;
              } else if (todo.status) {
                checked = true;
              }
        })
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this.countLeft$.next(quantity);
    this.checkedAtLeastOne$.next(checked);
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
    this.destroy$.next();
    this.destroy$.complete();
  }
}
