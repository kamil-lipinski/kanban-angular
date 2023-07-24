import { Component, Inject, inject, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from '../task-dialog/task-dialog.component';
import { DocumentReference, Firestore, Timestamp, addDoc, collection, collectionData, deleteDoc, doc, runTransaction, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Task } from 'src/app/shared/models/task';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent{

  public projectId!: string;

  loadingTodo: boolean = true;
  loadingInProgress: boolean = true;
  loadingDone: boolean = true;

  todo: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  inProgress: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  done: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  constructor(private dialog: MatDialog, private store: Firestore, public authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
    });

    const todoCollection = collection(doc(this.store, 'projects', this.projectId), 'todo');
    const inProgressCollection = collection(doc(this.store, 'projects', this.projectId), 'inProgress');
    const doneCollection = collection(doc(this.store, 'projects', this.projectId), 'done');

    collectionData(todoCollection, { idField: 'id' }).pipe(
      tap((tasks) => {
        this.todo.next(tasks as Task[]);
        this.loadingTodo = false;
      })
    ).subscribe();

    collectionData(inProgressCollection, { idField: 'id' }).pipe(
      tap((tasks) => {
        this.inProgress.next(tasks as Task[]);
        this.loadingInProgress = false;
      })
    ).subscribe();

    collectionData(doneCollection, { idField: 'id' }).pipe(
      tap((tasks) => {
        this.done.next(tasks as Task[]);
        this.loadingDone = false;
      })
    ).subscribe();
  }

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult|undefined) => {
        if (!result) {
          return;
        }
        const docRef = doc(this.store, 'projects', this.projectId);
        addDoc(collection(docRef, 'todo'), result.task);
      });
  }

  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const taskWithDate = {
      ...task,
      dueTo: task.dueTo.toDate(), // Convert the Firestore Timestamp to a JavaScript Date
    }; 
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '30%',
      data: {
        task: taskWithDate,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult|undefined) => {
      if (!result) {
        return;
      }
      const docRef = doc(this.store, `projects/${this.projectId}/${list}/${task.id}`) as DocumentReference;
      if (result.delete) {
        deleteDoc(docRef);
      } else {
        updateDoc(docRef, { ... task });
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
