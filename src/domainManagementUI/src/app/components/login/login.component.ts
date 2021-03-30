// Angular Imports
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {
  FormControl,
  NgForm,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorStateMatcher } from '@angular/material/core';

// Local Service Imports
import { LoginService } from 'src/app/services/login.service';

// Models
import { Login } from 'src/app/models/login.model';

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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  model = new Login('', '');
  matcherusername = new MyErrorStateMatcher();
  matcherpassword = new MyErrorStateMatcher();

  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.loginService.logout();
  }

  submit() {
    this.model.username = this.username.value;
    this.model.password = this.password.value;
    this.loginService.postLogin(this.model).subscribe(
      (data) => {
        console.log(data);
        this.loginService.setSession(data);
      },
      (err) => {
        if (err instanceof HttpErrorResponse) {
          let httpError: HttpErrorResponse = err;
          if (httpError.status === 403) {
            // Username or password Failed
            this.error =
              'We were unable to log you in. Verify that you have the correct credentials';
          } else if (httpError.status === 423) {
            // Locked Out
            this.error = 'We were unable to log you in. Locked out.';
          } else if (httpError.status === 400) {
            // Generic Error
            this.error =
              'We were unable to log you in. Error with login. Try again.';
          } else if (httpError.status === 400) {
            this.error =
              'We were unable to log you in.  Error with login. Try again.';
          } else {
            // All other errors
            this.error =
              'We were unable to log you in.  Error with login. Try again.';
          }
        } else {
          this.error =
            'We were unable to log you in.  Error with login. Try again.';
        }
      }
    );
  }
}
