import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {

  public projectId!: string;
  private uid: string;
  form!: FormGroup;
  showLoading: boolean = false;
  project!: Project;
  private initialFormValues: any;

  constructor(
    private route: ActivatedRoute,
    private store: Firestore,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private router: Router,
    ) {this.uid = JSON.parse(localStorage.getItem('user')!).uid;}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
    });

    const projectRef = doc(this.store, 'projects', this.projectId);
    getDoc(projectRef).then((projectSnapshot) => {
      if (projectSnapshot.exists()) {
        this.project = projectSnapshot.data() as Project;
        this.initialFormValues = {
          title: this.project.title,
          key: this.project.key,
          colorCode: this.project.colorCode
        };

        this.form = this.formBuilder.group({
          title: [this.project.title, [Validators.required, Validators.minLength(6)]],
          key: [this.project.key, [Validators.required, Validators.maxLength(4), this.capitalizeLetters]],
          colorCode: [this.project.colorCode, [Validators.required]]
        }, {
          validator: this.anyFieldChangedValidator()
        });
      } else {
        console.error('Projekt nie istnieje.');
      }
    })
    .catch((error) => {
      console.error('Wystąpił błąd:', error);
    });
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

  anyFieldChangedValidator(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      if (!(formGroup instanceof FormGroup)) {
        return null; // Return null if the control is not a FormGroup
      }

      // Compare the current form values with the initial values
      const formFields = Object.keys(formGroup.controls);
      const formChanged = formFields.some((field) => {
        const currentValue = formGroup.controls[field].value;
        const initialValue = this.initialFormValues[field];
        return currentValue !== initialValue;
      });

      // Return the validation result based on whether any field is changed
      return formChanged ? null : { noChanges: true };
    };
  }

  editProject(){
    if (this.form.valid) {
      const projectData = {
        title: this.form.get('title')?.value,
        key: this.form.get('key')?.value,
        colorCode: this.form.get('colorCode')?.value,
      };
      const docRef = doc(this.store, `projects/${this.projectId}`);
      updateDoc(docRef, projectData).then(() => {
        this.router.navigate(['projects']);
        this.showLoading = false;
        this.snackbar.successSnackbar('Pomyślnie edytowano projekt.');
      }).catch((error) => {
        this.snackbar.errorSnackbar('Podczas edytowania projektu wystąpił błąd.');
      });
    }
  }

}
