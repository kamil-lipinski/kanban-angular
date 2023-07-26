import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';

fdescribe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
      ],
      providers: [
        AuthService,
        Auth,
        Firestore
      ],
    });

    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  // Add other test cases here...

  // it('should navigate to projects on successful login', async(() => {
  //   const email = 'test@example.com';
  //   const password = 'test123';

  //   authService.SignIn(email, password).then(() => {
  //     expect(mockRouter.navigate).toHaveBeenCalledWith(['projects']);
  //   });
  // }));

  // it('should show errorSnackbar for user not found on login failure', async(() => {
  //   const email = 'nonexistentuser@example.com';
  //   const password = 'test123';

  //   authService.SignIn(email, password).catch(() => {
  //     expect(mockSnackbarService.errorSnackbar).toHaveBeenCalledWith(
  //       'Użytkownik o podanym adresie E-mail nie istnieje.'
  //     );
  //   });
  // }));

  // it('should show errorSnackbar for wrong password on login failure', async(() => {
  //   const email = 'test@example.com';
  //   const password = 'wrongpassword';

  //   authService.SignIn(email, password).catch(() => {
  //     expect(mockSnackbarService.errorSnackbar).toHaveBeenCalledWith(
  //       'Wprowadzone hasło jest niepoprawne.'
  //     );
  //   });
  // }));

  // Add more test cases for other functions...
});
