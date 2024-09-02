import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {map, Observable} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FilterNames} from "../../types/filter-names";

@Component({
  selector: 'todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoFooterComponent {
  protected readonly FilterNames = FilterNames;
  @Input() count: number | null = 0;
  @Input() checkedAtLeastOne: boolean | null = false;
  @Output() clearedCompletedEvent: EventEmitter<string> = new EventEmitter<string>();
  filterParam$: Observable<string> = this.activatedRoute.queryParams.pipe(
    map((params: Params) => params[FilterNames.filter] ? params[FilterNames.filter] : ' '));

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  /**
   * Отправляет событие на удаление завершенных todo
   */
  clearCompleted(): void {
    this.clearedCompletedEvent.emit('');
  }

  /**
   * Меняет фильтр параметры согласно запросам
   * @param filter параметры фильтра url
   */
  choosingFilterParam(filter: string): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {filter},
      queryParamsHandling: 'merge'
    });
  }
}
