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
import { ResetPassword } from 'src/app/models/reset-password.model';

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
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  model = new ResetPassword();
  matcherusername = new MyErrorStateMatcher();
  matchercode = new MyErrorStateMatcher();
  matcherpassword = new MyErrorStateMatcher();
  matcherconfirmpassword = new MyErrorStateMatcher();

  username = new FormControl('', [Validators.required]);

  error: string;

  constructor(
    private snackBar: MatSnackBar,
    private LoginService: LoginService
  ) {}

  submit() {
    const username = this.username.value;
    this.LoginService.resetPassword(username, this.model).subscribe(
      () => {
        this.snackBar.open(
          `Password for user ${username} has been reset. You can now login.`,
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
