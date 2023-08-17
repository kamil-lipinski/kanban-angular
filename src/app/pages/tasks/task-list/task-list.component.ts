import { Component } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, runTransaction} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Task } from 'src/app/models/task';
import { Project } from 'src/app/models/project';
import { TaskDetailsDialogComponent } from '../task-details-dialog/task-details-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent{

  public projectId!: string;
  project!: Project;
  uid!: string;

  loadingTodo: boolean = true;
  loadingInProgress: boolean = true;
  loadingDone: boolean = true;

  todo: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  inProgress: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  done: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  constructor(private dialog: MatDialog,
    private store: Firestore,
    public authService: AuthService,
    private route: ActivatedRoute,
    private snackbar: SnackbarService,
    private router: Router,
    ){
    this.uid = JSON.parse(localStorage.getItem('user')!).uid;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
    });

    const projectRef = doc(this.store, 'projects', this.projectId);
    getDoc(projectRef).then((projectSnapshot) => {
      if (projectSnapshot.exists()) {
        this.project = projectSnapshot.data() as Project;
      } else {
        console.error('Projekt nie istnieje.');
      }
    })
    .catch((error) => {
      console.error('Wystąpił błąd:', error);
    });

    const todoCollection = collection(doc(this.store, 'projects', this.projectId), 'todo');
    const inProgressCollection = collection(doc(this.store, 'projects', this.projectId), 'inProgress');
    const doneCollection = collection(doc(this.store, 'projects', this.projectId), 'done');

    collectionData(todoCollection, { idField: 'id' }).pipe(
      tap((tasks) => {
        this.todo.next(this.sortTasksByDate(tasks) as Task[]);
        this.loadingTodo = false;
      })
    ).subscribe();

    collectionData(inProgressCollection, { idField: 'id' }).pipe(
      tap((tasks) => {
        this.inProgress.next(this.sortTasksByDate(tasks) as Task[]);
        this.loadingInProgress = false;
      })
    ).subscribe();

    collectionData(doneCollection, { idField: 'id' }).pipe(
      tap((tasks) => {
        this.done.next(this.sortTasksByDate(tasks) as Task[]);
        this.loadingDone = false;
      })
    ).subscribe();
  }

  sortTasksByDate(tasks: any[]): Task[] {
    return tasks.map((taskData: any) => {
      const task: Task = {
        id: taskData.id,
        title: taskData.title,
        description: taskData.description,
        dueTo: taskData.dueTo,
        createdBy: taskData.createdBy
      };
      return task;
    }).sort((a, b) => a.dueTo.toDate().getTime() - b.dueTo.toDate().getTime());
  }

  showDetails(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const breakpoint = window.innerWidth;
    let panelClass = '';

    if (breakpoint >= 1200) { // xl breakpoint and above
      panelClass = 'custom-dialog-xl';
    } else if (breakpoint >= 768) { // md breakpoint and above
      panelClass = 'custom-dialog-md';
    } else {
      panelClass = 'custom-dialog';
    }

    const dialogRef = this.dialog.open(TaskDetailsDialogComponent, {
      panelClass: panelClass,
      data: task,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) {
        return;
      }

      if (result.action === 'edit') {
        this.router.navigate([`/projects/${this.projectId}/tasks/${task.id}/${list}/edit-task`]);
      } else if (result.action === 'delete') {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '300px',
          data: 'Czy na pewno chcesz usunąć to zadanie?'
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            const docRef = doc(this.store, `projects/${this.projectId}/${list}/${task.id}`);
            deleteDoc(docRef).then(() => {
              this.snackbar.successSnackbar('Pomyślnie usunięto zadanie.');
            })
            .catch((error) => {
              this.snackbar.errorSnackbar('Podczas usuwania zadania wystąpił błąd.');
            });
          }
        });
      }
    });
  }

  drop(event: CdkDragDrop<Task[] | null>): void {
    if(!(event.previousContainer.data && event.container.data)){
      return;
    }
    if (event.previousContainer === event.container) {
      return;
    }
    const item = event.previousContainer.data[event.previousIndex];
    runTransaction(this.store, () => {
      const collectionRefPrevious = collection(doc(this.store, 'projects', this.projectId), event.previousContainer.id);
      const collectionRefCurrent = collection(doc(this.store, 'projects', this.projectId), event.container.id);

      const promise = Promise.all([
        deleteDoc(doc(collectionRefPrevious, item.id)),
        addDoc(collectionRefCurrent, item),
      ]);
      return promise;
    });
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
