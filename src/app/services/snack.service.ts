import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackService {

  constructor(
    private snack: MatSnackBar
  ) { }

  success(message: string, actionText?: string) {
    this.snack.open(message, actionText || 'Que bom!', {
      duration: 5000,
      verticalPosition: 'bottom',
      panelClass: 'success-snack'
    });

  }
  warning(message: string, actionText?: string) {
    this.snack.open(message, actionText || 'Opa...', {
      duration: 5000,
      verticalPosition: 'bottom',
      panelClass: 'warning-snack'
    });
  }
  danger(message: string, actionText?: string) {
    this.snack.open(message, actionText || 'Essa não!', {
      duration: 5000,
      verticalPosition: 'bottom',
      panelClass: 'danger-snack'
    });
  }
}
