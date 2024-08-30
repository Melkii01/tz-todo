import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {BehaviorSubject, map, Observable, tap} from "rxjs";
import {TodoListService} from "../services/todo-list.service";
import {FilterNames} from "../types/filter-names";
import {Todo} from "../types/todo";

@Component({
  selector: 'todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoAppComponent {
  todos$: BehaviorSubject<Todo[]> = this.todosListService.todos$;
  showedTodos$: BehaviorSubject<Todo[]> = this.todosListService.showedTodos$;
  countLeft$: Observable<number> = this.todosListService.countLeft$;
  checkedAtLeastOne$: Observable<boolean> = this.todosListService.checkedAtLeastOne$;

  private filterParam: string = '';
  filterParam$: Observable<string> = this.activatedRoute.queryParams.pipe(
    map((params: Params) => params[FilterNames.filter] ? params[FilterNames.filter] : ' '),
    tap((filter: string): void => {
      this.filterParam = filter;
      /** Показывает отфильрованный показываемый список todo */
      this.todosListService.setNewTodosList(this.todos$.getValue(), filter);
    }),
  );

  constructor(private activatedRoute: ActivatedRoute,
              private todosListService: TodoListService) {
  }

  /**
   * Добавляет новый todo в список
   * @param newTodoName название новой todo
   */
  addTodo(newTodoName: string): void {
    if (newTodoName) {
      this.todosListService.addTodo(newTodoName, this.filterParam);
    }
  }

  /**
   * Отмечает о выполненности todo или убирает метку
   * @param id идентификатор todo
   */
  toggleCheckedTodo(id: number): void {
    this.todosListService.toggleCheckedTodo(id, this.filterParam);
  }

  /**
   * Отмечает выполненными все todo или убирает метки
   */
  checkedAllTodo(): void {
    this.todosListService.checkedAllTodo(this.filterParam);
  }

  /**
   * Удаляет todo из списка
   * @param id идентификатор todo
   */
  removeTodo(id: number): void {
    this.todosListService.removeTodo(id, this.filterParam);
  }

  /**
   * Убирает из списка завершенные todo
   */
  clearedCompleted(): void {
    this.todosListService.clearedCompleted(this.filterParam);
  }

  /**
   * Редактироует todo
   */
  editTodo(event: Todo): void {
    this.todosListService.editTodo(event, this.filterParam);
  }
}
