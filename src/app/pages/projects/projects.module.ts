import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AuthModule } from '@angular/fire/auth';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsComponent } from './projects/projects.component';

const routes: Routes = [
  { path: '', component: ProjectsComponent }
];

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectDialogComponent,
    ProjectComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class ProjectsModule { }
