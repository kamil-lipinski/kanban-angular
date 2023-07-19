import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ProjectComponent } from './project/project.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AuthModule } from '@angular/fire/auth';


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectDialogComponent,
    ProjectComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedModule,
    FormsModule
  ],
  providers: []
})
export class ProjectsModule { }
