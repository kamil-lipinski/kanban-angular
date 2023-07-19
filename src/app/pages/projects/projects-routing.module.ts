import { TaskModule } from './../task.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { TaskListComponent } from '../task-list/task-list.component';

const routes: Routes = [
  { path: '', component: ProjectsComponent },
  { path: ':projectId/tasks', loadChildren: () => import('./../task.module').then(m => m.TaskModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }

// projects/{nazwa_projektu}/board
