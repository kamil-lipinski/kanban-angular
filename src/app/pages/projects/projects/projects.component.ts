import { Component, Inject, ViewChild, inject } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { DocumentReference, Firestore, addDoc, getDoc, collection, collectionData, deleteDoc, doc, runTransaction, updateDoc, query, where, or } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from 'src/app/shared/models/project';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProjectDialogComponent, ProjectDialogResult } from '../project-dialog/project-dialog.component';
import { ProjectDialogJoinComponent } from '../project-dialog-join/project-dialog-join.component';
import { User } from 'src/app/shared/models/user';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  private uid: string;
  projectId!: string;
  projects: Observable<Project[]>;
  dataSource!: MatTableDataSource<Project>;
  displayedColumns: string[] = ['title', 'key', 'owner', 'actions'];
  selectedRowForMenu: Project | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor
  (
    private dialog: MatDialog,
    private store: Firestore,
    public authService: AuthService,
    private snackbar: SnackbarService,
    private router: Router
  ){
    this.uid = JSON.parse(localStorage.getItem('user')!).uid;
    // this.uid = this.authService.userData.uid;

    const projectCollection = query(collection(this.store,'projects'),
      or(
        where(`members.${this.uid}`, '==', true),where('owner', '==', this.uid)
      )
    );

    this.projects = collectionData(projectCollection, { idField: 'id' }).pipe(
      map((project) => project as Project[])
    );

    // this.projects.subscribe((projects) => {
    //   this.dataSource = new MatTableDataSource(projects);
    // });
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
          owner: this.authService.userData.uid,
        };
        const docRef = collection(this.store, 'projects');
        addDoc(docRef, projectData);
      });
  }

  doJoinProject(projectId: string): void {

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

  joinProject(projectId: string): void {
    const dialogRef = this.dialog.open(ProjectDialogJoinComponent, {
      width: '270px',
      data: { projectId: projectId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.projectId) {
        this.doJoinProject(result.projectId);
      }
    });
  }

  editProject(): void {
    if (this.selectedRowForMenu) {
      const project = this.selectedRowForMenu;
      const dialogRef = this.dialog.open(ProjectDialogComponent, {
        width: '270px',
        data: {
          project,
          enableDelete: true,
        },
      });
      dialogRef.afterClosed().subscribe((result: ProjectDialogResult | undefined) => {
        if (!result) {
          return;
        }
        const docRef = doc(this.store, `projects/${project.id}`);
        if (result.delete) {
          deleteDoc(docRef);
        } else {
          updateDoc(docRef, { ...project });
        }
      });
    } else {
      console.log('No row selected for editing.');
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.projects.subscribe((projects) => {
      this.dataSource = new MatTableDataSource(projects);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator; // Ensure paginator is initialized here
    });
  }

  goToProjectTasks(projectId: string): void {
    this.router.navigate(['/projects', projectId, 'tasks']);
  }

}
