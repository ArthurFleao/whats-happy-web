import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackService {

  constructor(
    private snack: MatSnackBar
  ) { }

  success(message: string) {
    this.snack.open(message, 'Que bom!', {
      duration: message.length * 50,
      verticalPosition: 'bottom',
      panelClass: 'success-snack'
    });

  }
  warning(message: string) {
    this.snack.open(message, 'Nossa...', {
      duration: message.length * 50,
      verticalPosition: 'bottom',
      panelClass: 'warning-snack'
    });
  }
  danger(message: string) {
    this.snack.open(message, 'Essa não!', {
      duration: message.length * 50,
      verticalPosition: 'bottom',
      panelClass: 'danger-snack'
    });
  }
}
