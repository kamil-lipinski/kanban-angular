import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guard/auth.guard';
import { AuthRoutingModule } from './auth-routing.module';


@NgModule({
  imports: [
    provideAuth(() => getAuth()),
    SharedModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ],
  declarations: [
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
  ],
  exports: [

  ],
  providers:[AuthGuard, AuthService]
})
export class AuthModule { }
