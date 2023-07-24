import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDialogJoinComponent } from './project-dialog-join/project-dialog-join.component';
import { ProjectNewComponent } from './project-new/project-new.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectMemberGuard } from 'src/app/auth/guard/project-member.guard';
import { BreadcrumbModule } from 'xng-breadcrumb';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: { alias: 'projects' } },
    children: [
      { path: '', component: ProjectsComponent },
      { path: 'new-project', component: ProjectNewComponent, data: { breadcrumb: { alias: 'new-project' } } },
      { path: ':projectId/edit', component: ProjectEditComponent, canActivate:[ProjectMemberGuard],data: { breadcrumb: { alias: 'edit' } } },
      { path: ':projectId/tasks', 
        loadChildren: () => import('../tasks/task.module').then(m => m.TaskModule), 
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
