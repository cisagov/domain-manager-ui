// Angular Imports
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  NgForm,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
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

  error: string;

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.loginService.logout();
  }

  submit() {
    this.model.username = this.username.value;
    this.model.password = this.password.value;
    this.loginService.postLogin(this.model).subscribe({
      next: (data) => this.loginService.setSession(data),
      error: (error) => console.log(error),
      complete: () => console.info('successfully logged in'),
    });
  }
}
