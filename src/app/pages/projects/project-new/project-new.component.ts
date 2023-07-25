import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, Timestamp, } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar.service';


@Component({
  selector: 'app-project-new',
  templateUrl: './project-new.component.html',
  styleUrls: ['./project-new.component.css']
})
export class ProjectNewComponent implements OnInit{
  private uid: string;
  form!: FormGroup;
  showLoading: boolean = false;

  constructor(
    private store: Firestore,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private router: Router
  ){
    this.uid = JSON.parse(localStorage.getItem('user')!).uid;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50),]],
      key: ['', [Validators.required, Validators.maxLength(4), this.capitalizeLetters]],
      colorCode: [this.generateRandomColor(), [Validators.required]]
    });
  }

  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  capitalizeLetters(control: AbstractControl): { [key: string]: boolean } | null {
    const key = control.value;
    if (key && key.length > 0) {
      const capitalized = key.toUpperCase()
      if (key !== capitalized) {
        control.setValue(capitalized);
      }
    }
    return null;
  }

  newProject() {
    if (this.form.valid) {
      const projectData = {
        title: this.form.get('title')?.value,
        key: this.form.get('key')?.value,
        colorCode: this.form.get('colorCode')?.value,
        dateCreated: Timestamp.now(),
        owner: this.uid
      };
      const docRef = collection(this.store, 'projects');
      addDoc(docRef, projectData).then(() => {
        this.router.navigate(['projects']);
        this.showLoading = false;
        this.snackbar.successSnackbar('Pomyślnie utworzono nowy projekt.');
      }).catch((error) => {
        this.snackbar.errorSnackbar('Podczas tworzenia projektu wystąpił błąd.');
      });
    }
  }
}
