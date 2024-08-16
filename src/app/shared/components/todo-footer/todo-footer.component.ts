import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subject, takeUntil, tap} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FilterNames} from "../../types/filter-names";

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss']
})
export class TodoFooterComponent implements OnInit, OnDestroy {
  @Input() count: number | null = 0;
  @Output() clearedCompletedEvent = new EventEmitter<string>();
  @Input() checkedSomeOne: boolean | null = false;
  filterParam$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  protected readonly FilterNames = FilterNames;
  private destroy$ = new Subject<void>()

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.activatedRoute.queryParams.pipe(
      tap((params: Params) => {
        switch (params[FilterNames.filter]) {
          case FilterNames.all:
            this.filterParam$.next(FilterNames.all);
            break;

          case FilterNames.active:
            this.filterParam$.next(FilterNames.active);
            break;

          case FilterNames.completed:
            this.filterParam$.next(FilterNames.completed);
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
