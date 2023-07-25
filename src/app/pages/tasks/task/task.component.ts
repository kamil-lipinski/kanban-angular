import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../shared/models/task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent {
  @Input() task: Task | null = null;
  @Output() showDetails = new EventEmitter<Task>();

}
