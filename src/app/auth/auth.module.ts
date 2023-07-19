import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guard/auth.guard';
import { TaskListComponent } from '../pages/task-list/task-list.component';
import { ProjectsComponent } from '../pages/projects/projects.component';
import { ProjectsModule } from '../pages/projects/projects.module';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  // { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] }
  // { path: 'projects', loadChildren: () => import('../pages/projects/projects.module').then(m => m.ProjectsModule), canActivate:[AuthGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    provideAuth(() => getAuth()),
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
  ],
  exports: [
    CommonModule
  ],
  providers:[AuthGuard, AuthService]
})
export class AuthModule { }
