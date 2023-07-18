import { AuthService } from './../../auth/services/auth.service';
import { Component, Inject, inject } from '@angular/core';
import { Task } from '../../shared/models/task';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from '../task-dialog/task-dialog.component';
import { DocumentReference, Firestore, addDoc, getDoc, collection, collectionData, deleteDoc, doc, runTransaction, updateDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from 'src/app/shared/models/project';
import { ProjectDialogComponent, ProjectDialogResult } from './project-dialog/project-dialog.component';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  private uid: string;

  projectId!: string;

  projects: Observable<Project[]>;

  constructor(private dialog: MatDialog, private store: Firestore, public authService: AuthService, private snackbar: SnackbarService) {
    this.uid = JSON.parse(localStorage.getItem('user')!).uid;

    const projectCollection = query(collection(this.store,'projects'), where(`members.${this.uid}`, '==', true));

    this.projects = collectionData(projectCollection, { idField: 'id' }).pipe(
      map((project) => project as Project[])
    );
  }

  newProject(): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '270px',
      data: {
        project: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: ProjectDialogResult|undefined) => {
        if (!result) {
          return;
        }
        const projectData = {
          ...result.project,
          members: {
            [this.uid]: true, // Add the current user as a member
          },
        };
        const docRef = collection(this.store, 'projects');
        addDoc(docRef, projectData);
      });
  }

  joinProject(projectId: string): void {
    const projectRef = doc(this.store, 'projects', projectId);

    const memberData = {
      [this.uid]: true, // Add the current user as a member
    };

    getDoc(projectRef).then((projectSnapshot) => {
      if (projectSnapshot.exists()) {
        const projectData = projectSnapshot.data();
        const existingMembers = projectData?.['members'] || {};

        // Check if the user is already a member
        if (existingMembers.hasOwnProperty(this.uid)) {
          this.snackbar.errorSnackbar('You are already a member of this project');
          return;
        }

        const updatedMembers = {
          ...existingMembers,
          ...memberData,
        };

        updateDoc(projectRef, { members: updatedMembers })
          .then(() => {
            this.snackbar.succesSnackbar('Joined the project successfully.');
          })
          .catch((error) => {
            this.snackbar.errorSnackbar('Error joining the project.');
          });
      } else {
        this.snackbar.errorSnackbar('Project does not exist.');
      }
    });
  }

  editProject(project: Project): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '270px',
      data: {
        project,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: ProjectDialogResult|undefined) => {
      if (!result) {
        return;
      }
      const docRef = doc(this.store, `projects/${project.id}`);
      if (result.delete) {
        deleteDoc(docRef);
      } else {
        updateDoc(docRef, { ... project });
      }
    });
  }

}
