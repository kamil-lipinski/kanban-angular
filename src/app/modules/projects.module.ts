import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { ProjectMemberGuard } from '../guards/project-member.guard';
import { ProjectDialogJoinComponent } from '../pages/projects/project-dialog-join/project-dialog-join.component';
import { ProjectEditComponent } from '../pages/projects/project-edit/project-edit.component';
import { ProjectNewComponent } from '../pages/projects/project-new/project-new.component';
import { ProjectsComponent } from '../pages/projects/projects/projects.component';
import { SharedModule } from './shared.module';


const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: { alias: 'projects' } },
    children: [
      { path: '', component: ProjectsComponent },
      { path: 'new-project', component: ProjectNewComponent, data: { breadcrumb: { alias: 'new-project' } } },
      { path: ':projectId/edit', component: ProjectEditComponent, canActivate:[ProjectMemberGuard],data: { breadcrumb: { alias: 'edit' } } },
      { path: ':projectId/tasks', 
        loadChildren: () => import('./task.module').then(m => m.TaskModule), 
        canActivate:[ProjectMemberGuard], 
        data: { breadcrumb: { alias: 'tasks' } }
      },
    ]
  },
];


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectDialogJoinComponent,
    ProjectNewComponent,
    ProjectEditComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    BreadcrumbModule
  ],
  exports: [RouterModule],
  providers: []
})
export class ProjectsModule { }
