import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {

  public uid;
  isProjektyActive!: boolean;

  constructor(public authService:AuthService, private router: Router) {
    this.uid = JSON.parse(localStorage.getItem('user')!).uid;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkProjektyActive();
    });
  }

  checkProjektyActive() {
    this.isProjektyActive = this.router.url.includes('/projects');
  }

}
