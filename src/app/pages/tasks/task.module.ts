import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskComponent } from './task/task.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { DateFormatPipe } from 'src/app/shared/pipes/date-format.pipe';
import { TaskDetailsDialogComponent } from './task-details-dialog/task-details-dialog.component';


const routes: Routes = [
  { path: '', component: TaskListComponent }
];

@NgModule({
  declarations:[
    TaskComponent,
    TaskDialogComponent,
    TaskListComponent,
    DateFormatPipe,
    TaskDetailsDialogComponent,
  ],
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
    BreadcrumbModule
  ],
  exports: [RouterModule],
  providers: []
})
export class TaskModule { }
