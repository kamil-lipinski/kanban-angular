import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectMemberGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private store: Firestore) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const projectId = next.params['projectId'];
    const user = JSON.parse(localStorage.getItem('user')!);

    if (this.authService.isLoggedIn !== true) {
      this.router.navigate(['sign-in'])
      return false
    }

    return this.isMemberOfProject(projectId, user.uid);
  }

  private async isMemberOfProject(projectId: string, uid: string): Promise<boolean> {
    const projectRef = doc(this.store, 'projects', projectId);

    try {
      const projectSnapshot = await getDoc(projectRef);
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
    } catch (error) {
      console.error('Error fetching project data:', error);
      return false;
    }
  }
}
