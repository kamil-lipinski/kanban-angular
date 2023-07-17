import { Injectable, NgZone } from '@angular/core';
import { User } from '../../shared/models/user';
import * as auth from 'firebase/auth';
import { Auth, authState } from '@angular/fire/auth';
import {Firestore, DocumentReference, doc, setDoc,} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable()

export class AuthService {
  errorSnackbar(message: string): void {
    const snackBarConfig: MatSnackBarConfig = {
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'end',
      duration: 3000,
    };
    this.snackBar.open(message, 'Zamknij', snackBarConfig);
  }

  succesSnackbar(message: string): void {
    const snackBarConfig: MatSnackBarConfig = {
      panelClass: ['succes-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'end',
      duration: 3000,
    };

    this.snackBar.open(message, 'Zamknij', snackBarConfig);
  }

  userData: any; // Save logged in user data
  constructor(
    public afs: Firestore, // Inject Firestore service
    public afAuth: Auth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private snackBar: MatSnackBar
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    authState(this.afAuth).subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
  // Sign in with email/password
  SignIn(email: string, password: string) {
    return auth.signInWithEmailAndPassword(this.afAuth, email, password)
      .then((result) => {
        this.SetUserData(result.user);
        authState(this.afAuth).subscribe((user) => {
          if (user) {
            this.router.navigate(['dashboard']);
          }
        });
      })
      .catch((error) => {
        if(error.message == 'Firebase: Error (auth/user-not-found).'){
          this.errorSnackbar('Użytkownik o podanym adresie E-mail nie istnieje.');
        }
        else if(error.message == 'Firebase: Error (auth/wrong-password).'){
          this.errorSnackbar('Wprowadzone hasło jest niepoprawne.');
        }
        else{
          this.errorSnackbar(`${error.message}`);
        }
      });
  }
  // Sign up with email/password
  SignUp(email: string, password: string) {
    auth.createUserWithEmailAndPassword(this.afAuth, email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
      })
      .catch((error) => {
        if(error.message == 'Firebase: Error (auth/email-already-in-use).'){
          this.errorSnackbar('Użytkownik o podanym adresie E-mail już istnieje.');
        }
        else{
          this.errorSnackbar(`${error.message}`);
        }
      });
  }
  // Send email verfificaiton when new user sign up
  SendVerificationMail(resend: boolean = false) {
    const user = this.afAuth.currentUser;
    if (user !== null) {
      return auth.sendEmailVerification(user).then(() => {
        this.router.navigate(['verify-email-address']);
        if(resend){
          this.succesSnackbar('Wysłana została wiadomość E-mail z nowym linkiem.');
          resend = false;
        }
      }).catch((error) => {
        if(error.message == 'Firebase: Error (auth/too-many-requests).'){
          this.errorSnackbar('Wiadomość z nowym linkiem została już wysłana.');
        }
        else{
          this.errorSnackbar(`${error.message}`);
        }
      });
    } else {
      return Promise.reject(new Error('No user is currently signed in.'));
    }
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return auth.sendPasswordResetEmail(this.afAuth,passwordResetEmail)
      .then(() => {
        this.succesSnackbar('Wiadomość E-mail z linkiem do zmiany hasła została wysłana.');
      })
      .catch((error) => {
        if(error.message == 'Firebase: Error (auth/user-not-found).'){
          this.errorSnackbar('Użytkownik o podanym adresie E-mail nie istnieje.');
        }
        else{
          this.errorSnackbar(`${error.message}`);
        }
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null ? true : false;
  }
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['dashboard']);
    });
  }
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return auth.signInWithPopup(this.afAuth, provider)
      .then((result) => {
        this.router.navigate(['dashboard']);
        this.SetUserData(result.user);
      })
      .catch((error) => {
        // window.alert(error);
      });
  }
  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef = doc(this.afs, `users/${user.uid}`) as DocumentReference;
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return setDoc(userRef, userData, {
      merge: true,
    });
  }
  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
}