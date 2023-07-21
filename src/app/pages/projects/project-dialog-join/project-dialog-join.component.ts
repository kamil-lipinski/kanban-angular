import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-project-dialog-join',
  templateUrl: './project-dialog-join.component.html',
  styleUrls: ['./project-dialog-join.component.css']
})
export class ProjectDialogJoinComponent{
  constructor(
    public dialogRef: MatDialogRef<ProjectDialogJoinComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  cancel(): void {
    this.dialogRef.close();
  }
}