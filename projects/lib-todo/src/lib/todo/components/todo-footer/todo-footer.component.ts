import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Subject, takeUntil, tap} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FilterNames} from "../../types/filter-names";

@Component({
  selector: 'todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoFooterComponent implements OnInit, OnDestroy {
  @Input() count: number | null = 0;
  @Input() checkedAtLeastOne: boolean | null = false;
  @Output() clearedCompletedEvent: EventEmitter<string> = new EventEmitter<string>();
  filterParam: string = '';
  protected readonly FilterNames = FilterNames;
  private destroy$: Subject<void> = new Subject<void>()

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.activatedRoute.queryParams.pipe(
      tap((params: Params): void => {
        this.filterParam = params[FilterNames.filter];
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
