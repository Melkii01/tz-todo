import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, switchMap, takeUntil, tap} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FilterNames} from "../../types/filter-names";

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss']
})
export class TodoFooterComponent implements OnInit, OnDestroy {
  @Input() count: number = 0;
  @Output() clearedCompletedEvent = new EventEmitter<string>();
  @Input() checkedSomeOne: boolean = false;
  public filterParam: string = '';
  protected readonly FilterNames = FilterNames;

  private destroy$ = new Subject<void>();
  activatedRoute = inject(ActivatedRoute);

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.activatedRoute.queryParams.pipe(
      tap((params: Params) => {
        switch (params[FilterNames.filter]) {
          case FilterNames.all:
            this.filterParam = FilterNames.all;
            break;

          case FilterNames.active:
            this.filterParam = FilterNames.active;
            break;

          case FilterNames.completed:
            this.filterParam = FilterNames.completed;
            break;
        }
      }),

      takeUntil(this.destroy$)
    ).subscribe();
  }

  /**
   * Отправляет событие на удаление завершенных todo
   */
  clearCompleted(): void {
    this.clearedCompletedEvent.emit('');
  }

  /**
   * Меняет фильтр параметры согласно запросам
   * @param filter параметры фильтра
   */
  choosingFilterParam(filter: string): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {filter},
      queryParamsHandling: 'merge'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
