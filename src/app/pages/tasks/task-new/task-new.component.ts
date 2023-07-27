import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, Timestamp, doc, } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-task-new',
  templateUrl: './task-new.component.html',
  styleUrls: ['./task-new.component.css']
})
export class TaskNewComponent implements OnInit {
  private uid: string;
  projectId!: string;
  form!: FormGroup;
  showLoading: boolean = false;
  minDate: Date;
  maxDate: Date;

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
    });

    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(30),]],
      description: ['', Validators.maxLength(500)],
      dueTo: ['', [Validators.required]]
    });
  }

  newTask() {
    if (this.form.valid) {
      const taskData = {
        title: this.form.get('title')?.value,
        description: this.form.get('description')?.value,
        dueTo: this.form.get('dueTo')?.value,
        createdBy: this.uid
      };
      const docRef = doc(this.store, 'projects', this.projectId);
      addDoc(collection(docRef, 'todo'), taskData).then(() => {
        this.router.navigate([`projects/${this.projectId}/tasks`]);
        this.showLoading = false;
        this.snackbar.successSnackbar('Pomyślnie utworzono nowe zadanie.');
      }).catch((error) => {
        this.snackbar.errorSnackbar('Podczas tworzenia zadania wystąpił błąd.');
      });
    }
  }

}
