import { Component, Inject, inject } from '@angular/core';
import { Task } from '../task/task';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from '../task-dialog/task-dialog.component';
import { DocumentReference, Firestore, addDoc, collection, collectionData, deleteDoc, doc, runTransaction, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  todo: Observable<Task[]>;
  inProgress: Observable<Task[]>;
  done: Observable<Task[]>;

  constructor(private dialog: MatDialog, private store: Firestore) {
    const todoCollection = collection(this.store, 'todo');
    const inProgressCollection = collection(this.store, 'inProgress');
    const doneCollection = collection(this.store, 'done');

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
        const docRef = collection(this.store, 'todo');
        addDoc(docRef, result.task);
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
      if (result.delete) {
        const docRef = doc(this.store, `${list}/${task.id}`) as DocumentReference;
        deleteDoc(docRef);
      } else {
        const docRef = doc(this.store, `${list}/${task.id}`) as DocumentReference;
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
      const collectionRefPrevious = collection(this.store, event.previousContainer.id);
      const collectionRefCurrent = collection(this.store, event.container.id);

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
