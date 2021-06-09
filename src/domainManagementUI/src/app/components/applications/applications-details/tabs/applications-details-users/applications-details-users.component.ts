import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-applications-details-users',
  templateUrl: './applications-details-users.component.html',
  styleUrls: ['./applications-details-users.component.scss'],
})
export class ApplicationsDetailsUsersComponent implements OnInit {
  @Input() users: UserModel[];

  displayedColumns = [
    'Username',
    'UserStatus',
    'UserCreateDate',
    'UserLastModifiedDate',
    'Enabled',
  ];

  constructor(public router: Router) {}

  ngOnInit(): void {}

  viewUser(username: string) {
    this.router.navigate([`/user/details/${username}`]);
  }
}
