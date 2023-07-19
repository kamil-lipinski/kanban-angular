import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup,  FormBuilder,  Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {
  hide = true;
  hide2 = true;
  form!: FormGroup;

  constructor(public authService: AuthService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, this.matchPasswordValidator.bind(this)]]
    });
  }

  matchPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = this.form?.get('password')?.value;
    const password2 = control.value;

    if (password !== password2) {
      return { 'mismatch': true };
    }

    return null;
  }
}
