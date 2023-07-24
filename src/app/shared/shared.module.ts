import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { UserInfoComponent } from './components/user-info/user-info.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    UserInfoComponent,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    UserInfoComponent
  ],
    providers: []
})
export class SharedModule { }
