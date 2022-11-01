import { Component } from '@angular/core';
import { DBManagementService } from 'src/app/services/db-management.service';

@Component({
  selector: 'db-management',
  templateUrl: './db-management.component.html',
  styleUrls: ['./db-management.component.scss'],
})
export class DBManagementComponent {
  constructor(public dbManagementSvc: DBManagementService) {}

  downloading = false;

  dumpData() {
    this.downloading = true;
    this.dbManagementSvc.dumpDatabaseData().subscribe({
      next: (data) => {
        const blob = new Blob([JSON.stringify(data)]);
        this.downloadObject('dm_dump_data.json', blob);
        this.downloading = false;
      },
      error: (err) => {
        console.log(err);
        this.downloading = false;
      },
    });
  }

  private downloadObject(filename, blob) {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }
}
