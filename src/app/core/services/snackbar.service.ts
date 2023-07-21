import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable()
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  errorSnackbar(message: string): void {
    const snackBarConfig: MatSnackBarConfig = {
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'end',
      duration: 3000,
    };
    this.snackBar.open(message, 'Zamknij', snackBarConfig);
  }

  successSnackbar(message: string): void {
    const snackBarConfig: MatSnackBarConfig = {
      panelClass: ['succes-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'end',
      duration: 3000,
    };

    this.snackBar.open(message, 'Zamknij', snackBarConfig);
  }

}
