import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-management-list',
  templateUrl: './user-management-list.component.html',
  styleUrls: ['./user-management-list.component.scss']
})
export class UserManagementListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log("test")
  }

}
