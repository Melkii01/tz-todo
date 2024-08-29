import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { BehaviorSubject, Observable, Subject, takeUntil, tap } from "rxjs";
import { TodoListService } from "../services/todo-list.service";
import { FilterNames } from "../types/filter-names";
import { Todo } from "../types/todo";

@Component({
  selector: 'todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoAppComponent implements OnInit, OnDestroy {
  todos$: BehaviorSubject<Todo[]> = this.todosListService.todos$;
  showedTodos$: BehaviorSubject<Todo[]> = this.todosListService.showedTodos$;
  private activeQueryParams: { filter: string } = { filter: '' };
  countLeft$: Observable<number> = this.todosListService.countLeft$;
  checkedAtLeastOne$: Observable<boolean> = this.todosListService.checkedAtLeastOne$;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute,
    private todosListService: TodoListService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(
      tap(((params: Params): void => {
        this.activeQueryParams.filter = params[FilterNames.filter];

        /** Показывает отфильрованный показываемый список todo */
        this.todosListService.setNewTodosList(this.todos$.getValue(), this.activeQueryParams.filter);
      }),
      ),
      takeUntil(this.destroy$)).subscribe();
  }

  /**
   * Добавляет новый todo в список
   * @param newTodoName название новой todo
   */
  addTodo(newTodoName: string): void {
    if (newTodoName) {
      this.todosListService.addTodo(newTodoName, this.activeQueryParams.filter);
    }
  }

  /**
   * Отмечает о выполненности todo или убирает метку
   * @param id идентификатор todo
   */
  toggleCheckedTodo(id: number): void {
    this.todosListService.toggleCheckedTodo(id, this.activeQueryParams.filter);
  }

  /**
   * Отмечает выполненными все todo или убирает метки
   */
  checkedAllTodo(): void {
    this.todosListService.checkedAllTodo(this.activeQueryParams.filter);
  }

  /**
   * Удаляет todo из списка
   * @param id идентификатор todo
   */
  removeTodo(id: number): void {
    this.todosListService.removeTodo(id, this.activeQueryParams.filter);
  }

  /**
   * Убирает из списка завершенные todo
   */
  clearedCompleted(): void {
    this.todosListService.clearedCompleted(this.activeQueryParams.filter);
  }

  /**
   * Редактироует todo
   */
  editTodo(event: Todo): void {
    this.todosListService.editTodo(event, this.activeQueryParams.filter);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
