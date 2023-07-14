import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { Auth, authState } from '@angular/fire/auth';
import {Firestore, DocumentReference, doc, setDoc,} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  userData: any; // Save logged in user data
  constructor(
    public afs: Firestore, // Inject Firestore service
    public afAuth: Auth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remov  e outside scope warning
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
        window.alert(error.message);
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
        window.alert(error.message);
      });
  }
  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    const user = this.afAuth.currentUser;
    if (user !== null) {
      return auth.sendEmailVerification(user).then(() => {
        this.router.navigate(['verify-email-address']);
      }).catch((error) => {
        window.alert(error);
      });
    } else {
      return Promise.reject(new Error('No user is currently signed in.'));
    }
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return auth.sendPasswordResetEmail(this.afAuth,passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
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
        window.alert(error);
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
