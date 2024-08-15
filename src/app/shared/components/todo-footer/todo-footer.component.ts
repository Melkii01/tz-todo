import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
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
  private subs: Subscription = new Subscription();
  public filterParam: string = '';
  protected readonly FilterNames = FilterNames;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.subs.add(this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params[FilterNames.filter] === FilterNames.all) {
        this.filterParam = FilterNames.all;
      } else if (params[FilterNames.filter] === FilterNames.active) {
        this.filterParam = FilterNames.active;
      } else if (params[FilterNames.filter] === FilterNames.completed) {
        this.filterParam = FilterNames.completed;
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
