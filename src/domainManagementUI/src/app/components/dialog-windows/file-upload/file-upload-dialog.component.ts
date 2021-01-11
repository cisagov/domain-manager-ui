// Angular Imports
import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ngfModule, ngf } from 'angular-file';

// Models
import { FileUploadSettings } from 'src/app/models/fileUploadSettings.model';

@Component({
  selector: 'file-upload-dialog',
  templateUrl: 'file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss'],
})
export class FileUploadDialogComponent {
  uploadType = 'File';
  uploadFileType = '*';
  uploadFunction = null;

  uploadProcessed = false;
  filesCurrentlyUploading = 0;

  //ngf specific variables
  files: File[] = [];
  progress: number;
  hasBaseDropZoneOver: boolean = false;
  lastFileAt: Date;
  sendableFormData: FormData; //populated via ngfFormData directive
  dragFiles: any;
  validComboDrag: any;
  lastInvalids: any;
  fileDropDisabled: any;
  maxSize: any;
  baseDropValid: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FileUploadSettings,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<FileUploadDialogComponent>
  ) {
    dialogRef.disableClose = true;
    this.uploadType = data.uploadType;
    this.uploadFunction = data.uploadFunction;
    console.log(data);
    this.uploadFileType = this.getNativeMimeType(data.uploadFileType);
  }

  uploadFiles() {
    console.log(this.uploadFunction);
    this.uploadProcessed = true;
    console.log(this.files);
    this.files.forEach((file) => {
      if (file['uploadStatus'] != 'Complete') {
        this.filesCurrentlyUploading += 1;
        file['uploadStatus'] = 'Inprogress';
        this.uploadFunction(file).subscribe(
          (success) => {
            file['uploadStatus'] = 'Complete';
          },
          (failure) => {
            file['uploadStatus'] = 'Failed';
            console.log(failure);
          }
        );
      }
    });
  }

  getDate() {
    console.log("get date for file called");
    return new Date();
  }
  
  getNativeMimeType(mimeType:string){
    let re = new RegExp('application/.*zip.*');
    if(re.test(mimeType)){
      switch(this.getOS()){
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
