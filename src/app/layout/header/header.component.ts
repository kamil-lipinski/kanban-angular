import { UserInfoComponent } from 'src/app/shared/components/user-info/user-info.component';
import { AuthService } from './../../auth/services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  public uid;

  constructor(public authService:AuthService) {
    this.uid = JSON.parse(localStorage.getItem('user')!).uid;
  }



}
