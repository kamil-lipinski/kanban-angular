import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskComponent } from './task/task.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { DateFormatPipe } from 'src/app/shared/pipes/date-format.pipe';
import { TaskDetailsDialogComponent } from './task-details-dialog/task-details-dialog.component';
import { TaskNewComponent } from './task-new/task-new.component';
import { TaskEditComponent } from './task-edit/task-edit.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: { alias: 'tasks' } },
    children: [
      { path: '', component: TaskListComponent },
      { path: 'new-task', component: TaskNewComponent, data: { breadcrumb: { alias: 'new-task' } } },
      { path: ':taskId/:type/edit-task', component: TaskEditComponent, data: { breadcrumb: { alias: 'edit-task' } } }
    ]
  },
];

@NgModule({
  declarations:[
    TaskComponent,
    TaskListComponent,
    DateFormatPipe,
    TaskDetailsDialogComponent,
    TaskNewComponent,
    TaskEditComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
    BreadcrumbModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule],
  providers: []
})
export class TaskModule { }
