import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { SharedModule } from './modules/shared.module';
import { AuthModule  } from './modules/auth.module';
import { MainComponent } from './pages/main/main.component';
import { CoreModule } from './modules/core.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { BreadcrumbModule, BreadcrumbService } from 'xng-breadcrumb';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from './services/snackbar.service';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';

const routes: Routes = [
  { path: '', component: MainComponent, canActivate:[AuthGuard], children:[
    { path: '', redirectTo: '/projects', pathMatch: 'full' },
    { path: 'projects', loadChildren: () => import('./modules/projects.module').then(m => m.ProjectsModule), data: {breadcrumb: { skip: false }}},
    { path: 'user', loadChildren: () => import('./modules/user.module').then(m => m.UserModule)},
  ] },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  { path: '404-not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/404-not-found' },
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NotFoundComponent,
    ConfirmationDialogComponent,
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    AuthModule,
    SharedModule,
    CoreModule,
    BreadcrumbModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [SnackbarService, BreadcrumbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
