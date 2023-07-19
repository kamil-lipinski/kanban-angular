import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskComponent } from './pages/task/task.component';
import { FormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from './shared/shared.module';
import { SnackbarService } from './core/services/snackbar.service';
import { TaskDialogComponent } from './pages/task-dialog/task-dialog.component';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { AuthService } from './auth/services/auth.service';
import { ProjectsModule } from './pages/projects/projects.module';
import { AuthModule } from '@angular/fire/auth';
import { AuthGuard } from './auth/guard/auth.guard';
import { TaskModule } from './pages/task.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    AppRoutingModule,
    SharedModule,
    ProjectsModule,
    AuthModule,
    TaskModule
  ],
  providers: [SnackbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
