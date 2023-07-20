import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectMemberGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private store: Firestore) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const projectId = next.params['projectId'];
    // const user = this.authService.userData;
    const user = JSON.parse(localStorage.getItem('user')!);

    if (this.authService.isLoggedIn !== true) {
      this.router.navigate(['sign-in'])
      return false
    }

    return this.isMemberOfProject(projectId, user.uid).pipe(
      catchError(() => {
        this.router.navigate(['404-not-found']);
        return of(false);
      })
    );
  }

  private isMemberOfProject(projectId: string, uid: string): Observable<boolean> {
    const projectRef = doc(this.store, 'projects', projectId);

    return from(getDoc(projectRef)).pipe(
      map(projectSnapshot => {
        if (projectSnapshot.exists()) {
          const projectData = projectSnapshot.data();
          const members = projectData?.['members'] || {};
          if (Object.prototype.hasOwnProperty.call(members, uid)) {
            return true;
          } else {
            this.router.navigate(['404-not-found']);
            return false;
          }
        } else {
          this.router.navigate(['404-not-found']);
          return false;
        }
      }),
      catchError(error => {
        console.error('Error fetching project data:', error);
        this.router.navigate(['404-not-found']);
        return of(false);
      })
    );
  }
}
