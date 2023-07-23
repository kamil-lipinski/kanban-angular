import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AuthModule } from '@angular/fire/auth';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDialogJoinComponent } from './project-dialog-join/project-dialog-join.component';
import { ProjectNewComponent } from './project-new/project-new.component';

const routes: Routes = [
  { path: '', component: ProjectsComponent },
  { path: 'new-project', component: ProjectNewComponent }
];

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectDialogComponent,
    ProjectDialogJoinComponent,
    ProjectNewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  exports: [RouterModule],
  providers: []
})
export class ProjectsModule { }
