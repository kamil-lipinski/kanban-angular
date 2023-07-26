import { Component, OnInit } from '@angular/core';
import { Firestore, doc, updateDoc, DocumentReference, getDoc, } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Task } from 'src/app/shared/models/task';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {
  private uid: string;
  public projectId!: string;
  public taskId!: string;
  public type!: string;
  form!: FormGroup;
  showLoading: boolean = false;
  minDate: Date;
  maxDate: Date;
  task!: Task;
  private initialFormValues: any;

  constructor(
    private store: Firestore,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private router: Router,
    private route: ActivatedRoute,
  ){
    this.uid = JSON.parse(localStorage.getItem('user')!).uid;
    const currentYear = new Date().getFullYear()
    this.minDate = new Date();
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
      this.taskId = params['taskId'];
      this.type = params['type'];
    });

    const taskRef = doc(this.store, `projects/${this.projectId}/${this.type}/${this.taskId}`) as DocumentReference;
    getDoc(taskRef).then((taskSnapshot) => {
      if (taskSnapshot.exists()) {
        this.task = taskSnapshot.data() as Task;
        this.initialFormValues = {
          title: this.task.title,
          description: this.task.description,
          dueTo: this.task.dueTo.toDate()
        };

        this.form = this.formBuilder.group({
          title: [this.task.title, [Validators.required, Validators.maxLength(30),]],
          description: [this.task.description],
          dueTo: [this.task.dueTo.toDate(), [Validators.required]]
        }, {
          validator: this.anyFieldChangedValidator()
        });
      }
    })
    .catch((error) => {
      console.error('Wystąpił błąd:', error);
    });
  }

  anyFieldChangedValidator(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      if (!(formGroup instanceof FormGroup)) {
        return null; // Return null if the control is not a FormGroup
      }

      // Compare the current form values with the initial values
      const formFields = Object.keys(formGroup.controls);
      const formChanged = formFields.some((field) => {
        const currentValue = formGroup.controls[field].value;

        // Handle date fields separately by converting them to string representation
        if (field === 'dueTo') {
          const initialDate = this.initialFormValues[field].toISOString();
          const currentDate = currentValue.toISOString();
          return initialDate !== currentDate;
        } else {
          const initialValue = this.initialFormValues[field];
          return currentValue !== initialValue;
        }
      });

      // Return the validation result based on whether any field is changed
      return formChanged ? null : { noChanges: true };
    };
  }

  editTask() {
    if (this.form.valid) {
      const taskData = {
        title: this.form.get('title')?.value,
        description: this.form.get('description')?.value,
        dueTo: this.form.get('dueTo')?.value,
      };
      const docRef = doc(this.store, `projects/${this.projectId}/${this.type}/${this.taskId}`) as DocumentReference;
      updateDoc(docRef, taskData).then(() => {
        this.router.navigate([`projects/${this.projectId}/tasks`]);
        this.showLoading = false;
        this.snackbar.successSnackbar('Pomyślnie edytowano zadanie.');
      }).catch((error) => {
        this.snackbar.errorSnackbar('Podczas edytowania zadania wystąpił błąd.');
      });
    }
  }

}
