import { Component } from '@angular/core';
import { DBManagementService } from 'src/app/services/db-management.service';

@Component({
  selector: 'db-management',
  templateUrl: './db-management.component.html',
  styleUrls: ['./db-management.component.scss'],
})
export class DBManagementComponent {
  constructor(public dbManagementSvc: DBManagementService) {}

  dumpData() {
    this.dbManagementSvc.dumpDatabaseData().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log('Error');
      },
    });
  }
}
