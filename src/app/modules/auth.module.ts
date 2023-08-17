
import { ReactiveFormsModule } from '@angular/forms';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { SharedModule } from 'src/app/modules/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ForgotPasswordComponent } from '../auth/forgot-password/forgot-password.component';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { SignUpComponent } from '../auth/sign-up/sign-up.component';
import { VerifyEmailComponent } from '../auth/verify-email/verify-email.component';


@NgModule({
  imports: [
    provideAuth(() => getAuth()),
    SharedModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
  ],
  exports: [RouterModule]
})
export class AuthModule { }
