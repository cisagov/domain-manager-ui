// Angular Imports
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
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
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
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
export class PasswordResetComponent implements OnInit {
  model = new ResetPassword();
  faBan = faBan;
  faCheck = faCheck;

  matcherusername = new MyErrorStateMatcher();
  matchercode = new MyErrorStateMatcher();
  matcherpassword = new MyErrorStateMatcher();
  matcherconfirmpassword = new MyErrorStateMatcher();
  minNumberOfChar = 8;
  username = null;

  userFormGroup = new FormGroup({
    code: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  error: string;

  constructor(
    public activeRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.username = params['username'];
    });
  }

  submit() {
    if (this.userFormGroup.valid) {
      this.model.confirmation_code = this.userFormGroup.controls.code.value;
      this.model.password = this.userFormGroup.controls.password.value;

      this.loginService.resetPassword(this.username, this.model).subscribe(
        () => {
          this.snackBar.open(
            `Password for user ${this.username} has been reset. You can now login.`,
            'close',
            {
              duration: 0,
              verticalPosition: 'top',
            },
          );
          this.router.navigateByUrl('/login');
        },
        (err: HttpErrorResponse) => {
          this.error = err.error;
          this.snackBar.open(`${this.error}`, 'close', {
            duration: 0,
            verticalPosition: 'top',
          });
        },
      );
    }
  }

  checkPasswordRules() {
    const pass: boolean =
      this.checkPasswordLength() &&
      this.checkPasswordUpperChar() &&
      this.checkPasswordLowerChar() &&
      this.checkPasswordSpecialChar() &&
      this.checkPasswordNumber() &&
      this.checkPasswordEquality();
    return pass;
  }

  checkPasswordEquality() {
    return (
      this.userFormGroup.controls.password.value ===
      this.userFormGroup.controls.confirmPassword.value
    );
  }

  checkPasswordLength() {
    if (this.userFormGroup.controls.password.value) {
      return (
        this.userFormGroup.controls.password.value.length >=
        this.minNumberOfChar
      );
    }
    return false;
  }

  checkPasswordUpperChar() {
    if (this.userFormGroup.controls.password.value) {
      return /[A-Z]/.test(this.userFormGroup.controls.password.value);
    }
    return false;
  }

  checkPasswordLowerChar() {
    if (this.userFormGroup.controls.password.value) {
      return /[a-z]/.test(this.userFormGroup.controls.password.value);
    }
    return false;
  }

  checkPasswordSpecialChar() {
    if (this.userFormGroup.controls.password.value) {
      return /[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/.test(
        this.userFormGroup.controls.password.value,
      );
    }
    return false;
  }

  checkPasswordNumber() {
    if (this.userFormGroup.controls.password.value) {
      return /[\d/]/.test(this.userFormGroup.controls.password.value);
    }
    return false;
  }
}
