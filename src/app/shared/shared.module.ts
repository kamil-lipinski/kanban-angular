import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { AuthModule } from '@angular/fire/auth';
import { AuthService } from '../auth/services/auth.service';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [],
  exports: [
    CommonModule,
    MaterialModule,
    AuthModule
  ],
    providers: []
})
export class SharedModule { }
