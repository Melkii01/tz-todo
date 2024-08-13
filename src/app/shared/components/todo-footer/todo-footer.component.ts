import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss']
})
export class TodoFooterComponent implements OnInit {
  @Input() count: number = 0;
  @Output() clearedCompletedEvent = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Убрать заврешенные todo (надо доработать)
   */
  clearCompleted() {
    this.clearedCompletedEvent.emit('');
  }
}
