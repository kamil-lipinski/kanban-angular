import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarService } from './snackbar.service';

fdescribe('SnackbarService', () => {
  let snackbarService: SnackbarService;
  let mockSnackBar: any;

  beforeEach(() => {
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        { provide: MatSnackBar, useValue: mockSnackBar },
        SnackbarService],
    });

    snackbarService = TestBed.inject(SnackbarService);
  });

  it('should be created', () => {
    expect(snackbarService).toBeTruthy();
  });

  it('should call MatSnackBar.open with error message', () => {
    const errorMessage = 'This is an error message';
    snackbarService.errorSnackbar(errorMessage);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      errorMessage,
      'Zamknij',
      jasmine.objectContaining({
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 3000,
      })
    );
  });

  it('should call MatSnackBar.open with success message', () => {
    const successMessage = 'This is a success message';
    snackbarService.successSnackbar(successMessage);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      successMessage,
      'Zamknij',
      jasmine.objectContaining({
        panelClass: ['succes-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 3000,
      })
    );
  });
});
