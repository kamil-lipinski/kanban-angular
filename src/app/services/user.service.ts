import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) {}

  async getUserById(userId: string): Promise<User | undefined> {
    const userRef = doc(this.firestore, 'users', userId);

    try {
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const user = userSnapshot.data() as User;
        return user;
      } else {
        return undefined;
      }
    } catch (error) {
      throw error;
    }
  }
}
