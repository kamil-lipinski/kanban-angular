import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) {}

  getUserById(userId: string): Observable<User | undefined> {
    const userRef = doc(this.firestore, 'users', userId);

    return new Observable<User | undefined>((observer) => {
      getDoc(userRef)
        .then((userSnapshot) => {
          if (userSnapshot.exists()) {
            const user = userSnapshot.data() as User;
            observer.next(user);
          } else {
            observer.next(undefined);
          }
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
