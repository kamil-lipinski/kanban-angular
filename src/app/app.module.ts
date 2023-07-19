import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { SnackbarService } from './core/services/snackbar.service';
import { ProjectsModule } from './pages/projects/projects.module';
import { AuthModule  } from './auth/auth.module';
import { MainComponent } from './pages/main/main.component';
import { CoreModule } from './core/core.module';
import { TaskModule } from './pages/tasks/task.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NotFoundComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    AppRoutingModule,
    AuthModule,
    SharedModule,
    CoreModule
  ],
  providers: [SnackbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
