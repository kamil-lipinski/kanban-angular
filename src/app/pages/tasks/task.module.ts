import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskComponent } from './task/task.component';


const routes: Routes = [
  { path: '', component: TaskListComponent }
];

@NgModule({
  declarations:[
    TaskComponent,
    TaskDialogComponent,
    TaskListComponent,
  ],
  imports: [
    SharedModule,
    // BrowserAnimationsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class TaskModule { }
