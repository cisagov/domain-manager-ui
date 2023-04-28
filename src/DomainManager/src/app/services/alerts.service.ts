//Angular Imports
import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

//Local Services
import { environment } from 'src/environments/environment';

@Injectable()
export class AlertsService {
  private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _snackBar: MatSnackBar) {}

  alert(
    alertMessage: string | Object,
    closeMessage: string = 'Close',
    duration: number = 5000,
    horizPosition: string = 'center',
    vertPosition: string = 'top',
  ) {
    this.horizontalPosition = horizPosition as MatSnackBarHorizontalPosition;
    this.verticalPosition = vertPosition as MatSnackBarVerticalPosition;

    let displayMessage = '';
    if (typeof alertMessage === 'string') {
      displayMessage = alertMessage;
    } else if (alertMessage['name'] === 'HttpErrorResponse') {
      displayMessage = alertMessage['error']['error'];
    }

    this._snackBar.open(displayMessage, closeMessage, {
      duration: duration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  //Horizontal Positions
  // start
  // center
  // end
  // left
  // right

  //Vertical Postions
  // top
  // bottom
}
