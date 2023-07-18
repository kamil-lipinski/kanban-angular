import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task/task.component';
import { SharedModule } from '../shared/shared.module';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { TaskListComponent } from './task-list/task-list.component';
import { AuthService } from '../auth/services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { Routes } from '@angular/router';


const routes: Routes = [
  { path: ':projectID/boards', component: TaskListComponent }
];

@NgModule({
  declarations:[
    TaskComponent,
    TaskDialogComponent,
    TaskListComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [AuthService]
})
export class TaskModule { }
