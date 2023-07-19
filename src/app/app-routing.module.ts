import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { MainComponent } from './pages/main/main.component';


const routes: Routes = [
  { path: '', component: MainComponent, canActivate:[AuthGuard], children:[
    { path: '', redirectTo: '/projects', pathMatch: 'full' },
    { path: 'projects', loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule)},
    { path: 'projects/:projectId/tasks', loadChildren: () => import('./pages/tasks/task.module').then(m => m.TaskModule)},
    { path: 'user', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule)},
  ] },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
