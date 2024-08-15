import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FilterNamesEnum} from "../../types/filter-names.enum";

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss']
})
export class TodoFooterComponent implements OnInit, OnDestroy {
  @Input() count: number = 0;
  @Output() clearedCompletedEvent = new EventEmitter<string>();
  @Input() checkedSomeOne: boolean = false;
  private subs: Subscription = new Subscription();
  public filterParam: string = '';
  protected readonly FilterNamesEnum = FilterNamesEnum;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.subs.add(this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params[FilterNamesEnum.filter] === FilterNamesEnum.all) {
        this.filterParam = FilterNamesEnum.all;
      } else if (params[FilterNamesEnum.filter] === FilterNamesEnum.active) {
        this.filterParam = FilterNamesEnum.active;
      } else if (params[FilterNamesEnum.filter] === FilterNamesEnum.completed) {
        this.filterParam = FilterNamesEnum.completed;
      }
    }));
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
    this.subs.unsubscribe();
  }

}
