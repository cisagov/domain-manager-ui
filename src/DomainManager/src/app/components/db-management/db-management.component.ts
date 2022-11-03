import { Component } from '@angular/core';
import { AlertsService } from 'src/app/services/alerts.service';
import { DBManagementService } from 'src/app/services/db-management.service';

@Component({
  selector: 'db-management',
  templateUrl: './db-management.component.html',
  styleUrls: ['./db-management.component.scss'],
})
export class DBManagementComponent {
  constructor(
    public dbManagementSvc: DBManagementService,
    public alertsSvc: AlertsService
  ) {}

  downloading = false;
  uploading = false;
  selectedFile: File = null;
  jsonObj: {} = {};

  dumpData() {
    this.downloading = true;
    this.dbManagementSvc.dumpDatabaseData().subscribe({
      next: (data) => {
        const blob = new Blob([data as any]);
        this.downloadObject('dm_dump_data.bson', blob);
        this.downloading = false;
      },
      error: (err) => {
        console.log(err);
        this.downloading = false;
      },
    });
  }

  addFile(event) {
    this.selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile, 'UTF-8');
    fileReader.onload = () => {
      this.jsonObj = JSON.parse(fileReader.result.toString());
    };
    fileReader.onerror = (error) => {
      console.log(error);
    };
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    const element: HTMLElement = document.getElementById(
      'fileUpload'
    ) as HTMLElement;
    element.click();
  }

  uploadData() {
    this.uploading = true;
    this.dbManagementSvc.loadDatabaseData(this.jsonObj).subscribe({
      next: (data) => {
        this.alertsSvc.alert('Data has been successfully loaded.');
        this.uploading = false;
      },
      error: (err) => {
        console.log(err);
        this.uploading = false;
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
