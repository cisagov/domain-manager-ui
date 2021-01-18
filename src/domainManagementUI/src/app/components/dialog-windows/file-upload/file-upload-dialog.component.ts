// Angular Imports
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { HttpEvent, HttpEventType } from '@angular/common/http';
// Models
import { FileUploadSettings } from 'src/app/models/fileUploadSettings.model';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: 'file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss'],
})
export class FileUploadDialogComponent implements OnInit {
  uploadType = 'File';
  uploadFileType = '*';

  uploadProcessed = false;
  filesCurrentlyUploading = 0;

  // ngf specific variables
  files: File[] = [];
  postName: string[] = [];
  progress: number;
  hasBaseDropZoneOver = false;
  lastFileAt: Date;
  sendableFormData: FormData; // populated via ngfFormData directive
  dragFiles: any;
  validComboDrag: any;
  lastInvalids: any;
  fileDropDisabled: any;
  multipleFileUpload: boolean;
  maxSize: any;
  baseDropValid: any;
  httpEvent: HttpEvent<{}>;
  uploadPercent: number;
  fileCounter = 0;
  overwrite = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FileUploadSettings,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<FileUploadDialogComponent>
  ) {
    dialogRef.disableClose = true;
    this.uploadFileType = this.getNativeMimeType(data.uploadFileType);
    this.multipleFileUpload = data.multipleFileUpload;
  }
  ngOnInit(): void {
    this.data.uploadService.preloadValidationData();
  }

  uploadFiles() {
    //TODO: This is currently iterating over all files for
    //all files need to change it to only do 1 file at a time
    this.uploadProcessed = true;
    if (this.overwrite)
      this.overwrite = confirm(
        'Template already exists. Would you like to Overwrite?'
      );
    this.sendableFormData.append('Website_Id', this.data.ID);
    this.sendableFormData.append('Website_Domain', this.data.WebsiteDomain);
    this.data.uploadService
      .uploadFile(this.sendableFormData, this.overwrite)
      .subscribe((resp) => {
        if (resp.type === HttpEventType.Response) {
          this.files.forEach((file) => {
            file['uploadStatus'] = 'Complete';
          });
        }
        if (resp.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round((100 * resp.loaded) / resp.total);
          console.log('Progress ' + percentDone + '%');
          this.files.forEach((file) => {
            file['uploadStatus'] = 'Inprogress';
          });
        }
      });
  }

  fileAdded() {
    const invalidfiles = this.data.uploadService.validateBeforeUpload(
      this.files
    );
    if (invalidfiles.length > 0) {
      this.overwrite = true;
      for (const file of invalidfiles) {
        this.setFileStatus(file.name, file.status);
      }
    }
    this.lastFileAt = new Date();
  }

  setFileStatus(filename: string, status: string) {
    this.files.forEach((file) => {
      if (file.name === filename) {
        file['uploadStatus'] = status;
      }
    });
  }

  getNativeMimeType(mimeType: string) {
    const re = new RegExp('application/.*zip.*');
    if (re.test(mimeType)) {
      switch (this.getOS()) {
        case 'Android':
        case 'Linux':
        case 'Mac OS':
        case 'iOS':
          return 'application/zip';
        case 'Windows':
          return 'application/x-zip-compressed';
      }
    }
    return mimeType;
  }

  getOS() {
    var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
    return os;
  }
}
