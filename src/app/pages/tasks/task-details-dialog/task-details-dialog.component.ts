import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from 'src/app/shared/models/task';

@Component({
  selector: 'app-task-details-dialog',
  templateUrl: './task-details-dialog.component.html',
  styleUrls: ['./task-details-dialog.component.css']
})
export class TaskDetailsDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Task,
  public dialogRef: MatDialogRef<TaskDetailsDialogComponent>) {}

  ngOnInit() {}

  editTask(){
    this.dialogRef.close({ action: 'edit', task: this.data });
  }

  deleteTask(){
    this.dialogRef.close({ action: 'delete', task: this.data });
  }
}
