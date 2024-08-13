import {Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss']
})
export class TodoFooterComponent implements OnInit, OnDestroy {
  @Input() count: number = 0;
  @Output() clearedCompletedEvent = new EventEmitter<string>();

  private subs: Subscription = new Subscription();

  public filterParam: string = '';

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.subs.add(this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params['filter'] === 'all') {
        this.filterParam = 'all';
      } else if (params['filter'] === 'active') {
        this.filterParam = 'active';
      } else if (params['filter'] === 'completed') {
        this.filterParam = 'completed';
      }
    }));
  }

  /**
   * Убрать заврешенные todo (надо доработать)
   */
  clearCompleted() {
    this.clearedCompletedEvent.emit('');
  }

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
