import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { BreadcrumbModule } from "xng-breadcrumb";
import { TaskDetailsDialogComponent } from "../pages/tasks/task-details-dialog/task-details-dialog.component";
import { TaskEditComponent } from "../pages/tasks/task-edit/task-edit.component";
import { TaskListComponent } from "../pages/tasks/task-list/task-list.component";
import { TaskNewComponent } from "../pages/tasks/task-new/task-new.component";
import { TaskComponent } from "../pages/tasks/task/task.component";
import { DateFormatPipe } from "../pipes/date-format.pipe";
import { SharedModule } from "./shared.module";



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
