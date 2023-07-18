import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from 'src/app/shared/models/project';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.css']
})
export class ProjectDialogComponent{
  private backupProject: Partial<Project> = { ...this.data.project };

  constructor(
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectDialogData
  ) {}

  cancel(): void {
    this.data.project.title = this.backupProject.title;
    this.data.project.key = this.backupProject.key;
    this.data.project.colorCode = this.backupProject.colorCode;

    this.dialogRef.close(this.data);
  }
}

export interface ProjectDialogData {
  project: Partial<Project>;
  enableDelete: boolean;
}

export interface ProjectDialogResult {
  project: Project;
  delete?: boolean;
}
