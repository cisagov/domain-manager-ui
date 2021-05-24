// Angular Imports
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {
  FormControl,
  NgForm,
  FormGroupDirective,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { RegisterUser } from 'src/app/models/registered-user.model';

// Third party imports
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';

// Local Service Imports
import { ApplicationService } from 'src/app/services/applications.service';
import { UserManagementService } from 'src/app/services/user-management.service';
import { AlertsService } from 'src/app/services/alerts.service';

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
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent implements OnInit {
  model = new RegisterUser();
  faBan = faBan;
  faCheck = faCheck;

  application_list = [];
  minNumberOfChar = 8;
  matcherusername = new MyErrorStateMatcher();
  matcherpassword = new MyErrorStateMatcher();
  matcherconfirmpassword = new MyErrorStateMatcher();
  matchemail = new MyErrorStateMatcher();

  userFormGroup = new FormGroup({
    firstname: new FormControl('', [
      Validators.required,
      Validators.pattern('^[A-za-z]*$'),
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.pattern('^[A-za-z]*$'),
    ]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    confirmPassword: new FormControl('', [Validators.required]),
    application_id: new FormControl('', [Validators.required]),
  });

  error: string;

  constructor(
    public alertsSvc: AlertsService,
    public applicationSvc: ApplicationService,
    private router: Router,
    private snackBar: MatSnackBar,
    public userSvc: UserManagementService
  ) {}

  ngOnInit() {
    this.getApplicationData();
  }

  submit() {
    if (this.userFormGroup.valid) {
      this.model.Username = `${this.model.FirstName.toLowerCase()}.${this.model.LastName.toLowerCase()}`;
      this.userSvc.postCreateUser(this.model).subscribe(
        (data) => {
          this.snackBar.open(
            `User created successfully (${this.model.Username}), your account is awaiting admin approval`,
            'close',
            {
              duration: 0,
              verticalPosition: 'top',
            }
          );
          this.router.navigateByUrl('/login');
        },
        (error: HttpErrorResponse) => {
          this.error = error.error;
        }
      );
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  checkPasswordRules() {
    const pass: boolean =
      this.checkPasswordLength() &&
      this.checkPasswordUpperChar() &&
      this.checkPasswordLowerChar() &&
      this.checkPasswordSpecialChar() &&
      this.checkPasswordNumber() &&
      this.checkPasswordEquality() &&
      this.userFormGroup.controls.username.value;
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
        this.userFormGroup.controls.password.value
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

  getApplicationData() {
    this.applicationSvc.getAllApplicationsNoAuth().subscribe(
      (success) => {
        this.application_list = success as [];
      },
      (failure) => {
        this.alertsSvc.alert(failure);
      }
    );
  }
  changeApplication(value) {
    if (value) {
      this.model.ApplicationName = this.application_list.filter(
        (app) => app._id == value
      )[0]['name'];
      this.model.ApplicationUUID = value;
    } else {
      this.model.ApplicationName = null;
      this.model.ApplicationUUID = null;
    }
  }
}
