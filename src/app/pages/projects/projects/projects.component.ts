import { Component, Inject, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { DocumentReference, Firestore, addDoc, getDoc, collection, collectionData, deleteDoc, doc, runTransaction, updateDoc, query, where, or, Timestamp, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';
import { Project } from 'src/app/shared/models/project';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { ProjectDialogJoinComponent } from '../project-dialog-join/project-dialog-join.component';
import { User } from 'src/app/shared/models/user';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { UserService } from 'src/app/core/services/user.service';
import { UserInfoComponent } from 'src/app/shared/components/user-info/user-info.component';


interface ProjectWithOwnerEmail extends Project {
  ownerEmail: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  private uid: string;
  projectId!: string;
  projects: Observable<Project[]>;
  dataSource!: MatTableDataSource<ProjectWithOwnerEmail>;
  displayedColumns: string[] = ['colorCode', 'title', 'key', 'owner', 'actions'];
  selectedRowForMenu: Project | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor
    (
      private dialog: MatDialog,
      private store: Firestore,
      public authService: AuthService,
      private snackbar: SnackbarService,
      private router: Router,
      private userService: UserService
    ) {
    this.uid = JSON.parse(localStorage.getItem('user')!).uid;
    // this.uid = this.authService.userData.uid;

    const projectCollection = query(collection(this.store, 'projects'),
      or(
        where(`members.${this.uid}`, '==', true), where('owner', '==', this.uid)
      )
    );

    this.projects = collectionData(projectCollection, { idField: 'id' }).pipe(
      map((project) => project as Project[]),
      map((project) => {
        return project.sort((a, b) => {
          return b.dateCreated.toMillis() - a.dateCreated.toMillis();
        });
      })
    );

  }

  newProject(): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '300px',
      data: {
        project: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }
        const timestamp = Timestamp.now();
        const projectData = {
          ...result.project,
          dateCreated: timestamp, 
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
        const owner = projectData?.['owner'] || '';

        // Check if the user is already a member
        if (existingMembers.hasOwnProperty(this.uid) || owner === this.uid) {
          this.snackbar.errorSnackbar('You are already a member of this project');
          return;
        }

        const updatedMembers = {
          ...existingMembers,
          ...memberData,
        };

        updateDoc(projectRef, { members: updatedMembers })
          .then(() => {
            this.snackbar.successSnackbar('Joined the project successfully.');
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
      width: '300px',
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
        width: '300px',
        data: {
          project,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (!result) {
          return;
        }
        delete result.project.ownerEmail;
        const docRef = doc(this.store, `projects/${project.id}`);
        updateDoc(docRef, { ...result.project });
      });
    } else {
      console.log('No row selected for editing.');
    }
  }

  deleteProject(): void {
    if (this.selectedRowForMenu) {
      const project = this.selectedRowForMenu;
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: 'Czy na pewno chcesz usunąć ten projekt?'
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          const docRef = doc(this.store, `projects/${project.id}`);
          deleteDoc(docRef)
            .then(() => {
              this.snackbar.successSnackbar('Project deleted successfully.');
            })
            .catch((error) => {
              this.snackbar.errorSnackbar('Error deleting the project.');
            });
        }
      });
    } else {
      console.log('No row selected for deleting.');
    }
  }

  copyProjectId() {
    if (this.selectedRowForMenu) {
      const project = this.selectedRowForMenu;
      const projectId = project.id;
      navigator.clipboard.writeText(projectId).then(() => {
        this.snackbar.successSnackbar('Skopiowano ID projektu do schowka');
      }).catch((error) => {
        this.snackbar.errorSnackbar('Kopiowanie ID projektu do schowka nie powiodło się');
      });

    } else {
      console.log('No row selected for copying.');
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.projects.subscribe(async (projects) => {
      const projectOwners = new Set<string>();
      projects.forEach((project) => {
        projectOwners.add(project.owner);
      });

      // Fetch user data for project owners
      try {
        const ownerEmailMap = new Map<string, string>();
        const ownerIds = Array.from(projectOwners);
        for (const ownerId of ownerIds) {
          const user = await this.userService.getUserById(ownerId);
          if (user) {
            ownerEmailMap.set(ownerId, user.email);
          }
        }

        // Update dataSource with userEmail for each project
        const projectsWithUserEmail: ProjectWithOwnerEmail[] = projects.map((project) => {
          return {
            ...project,
            ownerEmail: ownerEmailMap.get(project.owner) || 'N/A' // 'N/A' or handle appropriately if user email is missing
          };
        });

        this.dataSource = new MatTableDataSource(projectsWithUserEmail);
        // Set other MatTableDataSource properties like sort and paginator
        this.dataSource.sortData = this.sortData();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      } catch (error) {
        console.error('Error fetching user data:', error);
        this.snackbar.errorSnackbar('Error fetching user data.');
      }
    });
  }

  goToProjectTasks(projectId: string): void {
    this.router.navigate(['/projects', projectId, 'tasks']);
  }

  sortData() {
    let sortFunction = (items: ProjectWithOwnerEmail[], sort: MatSort): ProjectWithOwnerEmail[] => {
      if (!sort.active || sort.direction === '') {
        return items;
      }
      return items.sort((a: ProjectWithOwnerEmail, b: ProjectWithOwnerEmail) => {
        let comparatorResult = 0;
        switch (sort.active) {
          case 'title':
            comparatorResult = a.title.localeCompare(b.title);
            break;
          case 'key':
            comparatorResult = a.key.localeCompare(b.key);
            break;
          case 'owner':
            comparatorResult = a.ownerEmail.localeCompare(b.ownerEmail);
            break;
        }
        return comparatorResult * (sort.direction == 'asc' ? 1 : -1);
      });
    };
    return sortFunction;
  }
  

  

}