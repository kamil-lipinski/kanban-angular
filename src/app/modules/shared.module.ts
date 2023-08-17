import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { UserInfoComponent } from "../components/user-info/user-info.component";
import { MaterialModule } from "./material.module";

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
