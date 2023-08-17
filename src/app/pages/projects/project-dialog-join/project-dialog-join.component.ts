import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-project-dialog-join',
  templateUrl: './project-dialog-join.component.html'
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
