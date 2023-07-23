import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, query, where, or, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from 'src/app/shared/models/project';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Injectable()
export class ProjectsService {
  private uid: string;

  constructor(
    private store: Firestore,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.uid = authService.userData.uid;
  }

  getAllProjects(): Observable<Project[]> {
    const projectCollection = query(
      collection(this.store, 'projects'),
      or(
        where(`members.${this.uid}`, '==', true),
        where('owner', '==', this.uid)
      )
    );

    return collectionData(projectCollection, { idField: 'id' }).pipe(
      map((projects) => {
        return projects.sort((a, b) => {
          return b.dateCreated.toMillis() - a.dateCreated.toMillis();
        });
      })
    );
  }

  createProject(projectData: any): Promise<void> {
    const timestamp = Timestamp.now();
    const data = {
      ...projectData,
      dateCreated: timestamp,
      owner: this.uid,
    };
    const docRef = collection(this.store, 'projects');
    return addDoc(docRef, data);
  }

  joinProject(projectId: string): Promise<void> {
    const projectRef = doc(this.store, 'projects', projectId);
    const memberData = {
      [this.uid]: true, // Add the current user as a member
    };

    return getDoc(projectRef).then((projectSnapshot) => {
      if (projectSnapshot.exists()) {
        const projectData = projectSnapshot.data();
        const existingMembers = projectData?.['members'] || {};
        const owner = projectData?.['owner'] || '';

        // Check if the user is already a member
        if (existingMembers.hasOwnProperty(this.uid) || owner === this.uid) {
          return Promise.reject('You are already a member of this project');
        }

        const updatedMembers = {
          ...existingMembers,
          ...memberData,
        };

        return updateDoc(projectRef, { members: updatedMembers });
      } else {
        return Promise.reject('Project does not exist.');
      }
    });
  }

  updateProject(projectId: string, projectData: any): Promise<void> {
    const docRef = doc(this.store, `projects/${projectId}`);
    delete projectData.ownerEmail;
    return updateDoc(docRef, projectData);
  }

  deleteProject(projectId: string): Promise<void> {
    const docRef = doc(this.store, `projects/${projectId}`);
    return deleteDoc(docRef);
  }
}
