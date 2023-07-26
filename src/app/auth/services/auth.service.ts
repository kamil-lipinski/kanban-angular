import { Injectable, NgZone } from '@angular/core';
import { User } from '../../shared/models/user';
import * as auth from 'firebase/auth';
import { Auth, authState } from '@angular/fire/auth';
import {Firestore, DocumentReference, doc, setDoc,} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  showLoading = false;
  userData: any; // Save logged in user data
  constructor(
    public afs: Firestore, // Inject Firestore service
    public afAuth: Auth, // Inject Firebase auth service
    public router: Router,
    // public ngZone: NgZone, // NgZone service to remove outside scope warning
    private snackBar: SnackbarService
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

  showLoadingFunc(){
    this.showLoading = true;
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return auth.signInWithEmailAndPassword(this.afAuth, email, password)
      .then((result) => {
        this.SetUserData(result.user);
        authState(this.afAuth).subscribe((user) => {
          if (user) {
            this.router.navigate(['projects']);
            this.showLoading = false;
          }
        });
      })
      .catch((error) => {
        this.showLoading = false;
        if(error.message == 'Firebase: Error (auth/user-not-found).'){
          this.snackBar.errorSnackbar('Użytkownik o podanym adresie E-mail nie istnieje.');
        }
        else if(error.message == 'Firebase: Error (auth/wrong-password).'){
          this.snackBar.errorSnackbar('Wprowadzone hasło jest niepoprawne.');
        }
        else{
          this.snackBar.errorSnackbar(`${error.message}`);
        }
      });
  }
  // Sign up with email/password
  SignUp(email: string, password: string) {
    debugger
    auth.createUserWithEmailAndPassword(this.afAuth, email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
        this.showLoading = false;
      })
      .catch((error) => {
        if(error.message == 'Firebase: Error (auth/email-already-in-use).'){
          this.snackBar.errorSnackbar('Użytkownik o podanym adresie E-mail już istnieje.');
        }
        else if(error.message == 'Firebase: Error (auth/invalid-email).'){
          this.snackBar.errorSnackbar('Niepoprawny E-mail.');
        }
        else{
          this.snackBar.errorSnackbar(`${error.message}`);
        }
      });
      this.showLoading = false;
  }
  // Send email verfificaiton when new user sign up
  SendVerificationMail(resend: boolean = false) {
    const user = this.afAuth.currentUser;
    if (user !== null) {
      return auth.sendEmailVerification(user).then(() => {
        this.router.navigate(['verify-email-address']);
        if(resend){
          this.snackBar.successSnackbar('Wysłana została wiadomość E-mail z nowym linkiem.');
          resend = false;
        }
      }).catch((error) => {
        if(error.message == 'Firebase: Error (auth/too-many-requests).'){
          this.snackBar.errorSnackbar('Nowy link został już wysłany, poczekaj chwilę przed wysłaniem kolejnego.');
        }
        else{
          this.snackBar.errorSnackbar(`${error.message}`);
        }
      });
    } else {
      return Promise.reject(new Error('No user is currently signed in.'));
    }
  }

  SendVerificationMail2() {
    const user = this.afAuth.currentUser;
    if (user !== null) {
      return auth.sendEmailVerification(user).then(() => {
        this.snackBar.successSnackbar('Wysłana została wiadomość E-mail z nowym linkiem.');
      }).catch((error) => {
        if(error.message == 'Firebase: Error (auth/too-many-requests).'){
          this.snackBar.errorSnackbar('Nowy link został już wysłany, poczekaj chwilę przed wysłaniem kolejnego.');
        }
        else{
          this.snackBar.errorSnackbar(`${error.message}`);
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
        this.snackBar.successSnackbar('Wiadomość E-mail z linkiem do zmiany hasła została wysłana.');
        this.showLoading = false;
      })
      .catch((error) => {
        if(error.message == 'Firebase: Error (auth/user-not-found).' || error.message == 'Firebase: Error (auth/invalid-email).'){
          this.snackBar.errorSnackbar('Użytkownik o podanym adresie E-mail nie istnieje.');
        }
        else{
          this.snackBar.errorSnackbar(`${error.message}`);
        }
        this.showLoading = false;
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
      this.router.navigate(['projects']);
    });
  }
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return auth.signInWithPopup(this.afAuth, provider)
      .then((result) => {
        this.router.navigate(['projects']);
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
