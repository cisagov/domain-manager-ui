// Angular Imports
import { Component } from '@angular/core';
import {
  FormControl,
  NgForm,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// Local Service Imports
import { LoginService } from 'src/app/services/login.service';

// Models
import { ForgotPassword } from 'src/app/models/forgot-password.model';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  model = new ForgotPassword();
  matcherusername = new MyErrorStateMatcher();

  username = new FormControl('', [Validators.required]);

  error: string;

  constructor(
    private snackBar: MatSnackBar,
    private LoginService: LoginService
  ) {}

  submit() {
    this.model.Username = this.username.value;
    this.LoginService.triggerPasswordReset(this.model.Username).subscribe(
      () => {
        this.snackBar.open(
          `Email has been sent for user ${this.model.Username}, please check your inbox`,
          'close',
          {
            duration: 0,
            verticalPosition: 'top',
          }
        );
      },
      (err: HttpErrorResponse) => {
        this.error = err.error;
        this.snackBar.open(`${this.error}`, 'close', {
          duration: 0,
          verticalPosition: 'top',
        });
      }
    );
  }
}
