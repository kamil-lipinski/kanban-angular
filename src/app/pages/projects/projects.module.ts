import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AuthModule } from '@angular/fire/auth';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDialogJoinComponent } from './project-dialog-join/project-dialog-join.component';
import { ProjectNewComponent } from './project-new/project-new.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';

const routes: Routes = [
  { path: '', component: ProjectsComponent },
  { path: 'new-project', component: ProjectNewComponent },
  { path: ':projectId/edit', component: ProjectEditComponent }
];

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectDialogJoinComponent,
    ProjectNewComponent,
    ProjectEditComponent
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
