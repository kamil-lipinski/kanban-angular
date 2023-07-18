import { AuthService } from './../../auth/services/auth.service';
import { Component, Inject, inject } from '@angular/core';
import { Task } from '../../shared/models/task';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from '../task-dialog/task-dialog.component';
import { DocumentReference, Firestore, addDoc, collection, collectionData, deleteDoc, doc, runTransaction, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {

  private projectId: string;

  todo: Observable<Task[]>;
  inProgress: Observable<Task[]>;
  done: Observable<Task[]>;

  constructor(private dialog: MatDialog, private store: Firestore, public authService: AuthService, private route: ActivatedRoute) {

    this.projectId = this.route.snapshot.paramMap.get('projectId')!;

    const todoCollection = collection(doc(this.store, 'projects', this.projectId), 'todo');
    const inProgressCollection = collection(doc(this.store, 'projects', this.projectId), 'inProgress');
    const doneCollection = collection(doc(this.store, 'projects', this.projectId), 'done');

    this.todo = collectionData(todoCollection, { idField: 'id' }).pipe(
      map((tasks) => tasks as Task[])
    );

    this.inProgress = collectionData(inProgressCollection, { idField: 'id' }).pipe(
      map((tasks) => tasks as Task[])
    );

    this.done = collectionData(doneCollection, { idField: 'id' }).pipe(
      map((tasks) => tasks as Task[])
    );
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
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
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
