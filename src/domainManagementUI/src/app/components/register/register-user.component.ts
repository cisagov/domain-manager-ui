// Angular Imports
import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import {
  FormControl,
  NgForm,
  FormGroupDirective,
  Validators,
  FormGroup,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

import { RegisterUser } from "src/app/models/registered-user.model";

//Third party imports
import { faBan, faCheck } from "@fortawesome/free-solid-svg-icons";

// Local Service Imports
import { UserManagementService } from "src/app/services/user-management.service";

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
  selector: "app-register-user",
  templateUrl: "./register-user.component.html",
  styleUrls: ["./register-user.component.scss"],
})
export class RegisterUserComponent implements OnInit {
  model = new RegisterUser("", "", "");
  faBan = faBan;
  faCheck = faCheck;

  minNumberOfChar: number = 8;
  matcherusername = new MyErrorStateMatcher();
  matcherpassword = new MyErrorStateMatcher();
  matcherconfirmpassword = new MyErrorStateMatcher();
  matchemail = new MyErrorStateMatcher();

  userFormGroup = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    confirmPassword: new FormControl("", [Validators.required]),
  });

  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  constructor(
    public userSvc: UserManagementService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  submit() {
    if (this.userFormGroup.valid) {
      this.model.Username = this.userFormGroup.controls["username"].value;
      this.model.Email = this.userFormGroup.controls["email"].value;
      this.model.Password = this.userFormGroup.controls["password"].value;
      this.userSvc.postCreateUser(this.model).subscribe(
        (data) => {
          this.openSnackBar("User created successfully", "");
          this._router.navigateByUrl("/login");
        },
        (err) => {
          if (err instanceof HttpErrorResponse) {
            let httpError: HttpErrorResponse = err;
            this.error = "We are unable to create user";
          } else {
            this.error = "We are unable to create user";
          }
        }
      );
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  checkPasswordRules() {
    var pass: boolean =
      this.checkPasswordLength() &&
      this.checkPasswordUpperChar() &&
      this.checkPasswordLowerChar() &&
      this.checkPasswordSpecialChar() &&
      this.checkPasswordNumber() &&
      this.checkPasswordEquality() &&
      this.userFormGroup.controls["username"].value;
    return pass;
  }

  checkPasswordEquality() {
    var equal =
      this.userFormGroup.controls["password"].value ===
      this.userFormGroup.controls["confirmPassword"].value;
    return equal;
  }

  checkPasswordLength() {
    if (this.userFormGroup.controls["password"].value) {
      return (
        this.userFormGroup.controls["password"].value.length >=
        this.minNumberOfChar
      );
    }
    return false;
  }

  checkPasswordUpperChar() {
    if (this.userFormGroup.controls["password"].value) {
      return /[A-Z]/.test(this.userFormGroup.controls["password"].value);
    }
    return false;
  }

  checkPasswordLowerChar() {
    if (this.userFormGroup.controls["password"].value) {
      return /[a-z]/.test(this.userFormGroup.controls["password"].value);
    }
    return false;
  }

  checkPasswordSpecialChar() {
    if (this.userFormGroup.controls["password"].value) {
      return /[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/.test(
        this.userFormGroup.controls["password"].value
      );
    }
    return false;
  }

  checkPasswordNumber() {
    if (this.userFormGroup.controls["password"].value) {
      return /[\d/]/.test(this.userFormGroup.controls["password"].value);
    }
    return false;
  }
}