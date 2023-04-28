// Angular Imports
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApplicationService } from 'src/app/services/applications.service';
import { ApplicationModel } from 'src/app/models/application.model';
import { UserModel } from 'src/app/models/user.model';
import { UserManagementService } from 'src/app/services/user-management.service';

@Component({
  selector: 'app-applications-details',
  templateUrl: './applications-details.component.html',
  styleUrls: ['./applications-details.component.scss'],
})
export class ApplicationsDetailsComponent implements OnInit {
  selectedTabIndex = 0;

  applicationId: string;
  application: ApplicationModel;
  users: UserModel[];

  constructor(
    public activeRoute: ActivatedRoute,
    public applicationSvc: ApplicationService,
    public userSvc: UserManagementService,
  ) {}

  ngOnInit(): void {
    this.applicationId = this.activeRoute.snapshot.paramMap.get('_id');
    this.getApplication();
    this.getUsers();
  }

  getApplication() {
    this.applicationSvc.getApplication(this.applicationId).subscribe((data) => {
      this.application = data;
    });
  }

  getUsers() {
    this.userSvc.getAllUsers(this.applicationId).subscribe((data) => {
      this.users = data;
    });
  }

  onTabChanged(event) {}
}
