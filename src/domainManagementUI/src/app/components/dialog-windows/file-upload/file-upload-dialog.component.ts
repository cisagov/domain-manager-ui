// Angular Imports
import { Component, Inject, OnInit } from '@angular/core';
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { HttpEvent, HttpEventType } from '@angular/common/http';

// Models
import { ConfirmDialogSettings } from 'src/app/models/confirmDialogSettings.model';
import { FileUploadSettings } from 'src/app/models/fileUploadSettings.model';

// Local Servie Imports
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: 'file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss'],
})
export class FileUploadDialogComponent implements OnInit {
  isMultipleDisplayText = 'one';
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
    public alertsSvc: AlertsService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<FileUploadDialogComponent>
  ) {
    dialogRef.disableClose = true;
    this.uploadFileType = this.getNativeMimeType(data.uploadFileType);
    this.multipleFileUpload = data.multipleFileUpload;
  }
  ngOnInit(): void {
    this.data.uploadService.preloadValidationData();
    this.isMultipleDisplayText += !this.multipleFileUpload ? '' : ' or more';
  }

  uploadFiles() {
    //TODO: This is currently iterating over all files for
    //all files need to change it to only do 1 file at a time
    this.uploadProcessed = true;
    // if (this.overwrite)
    //   this.overwrite = confirm(
    //     'Template already exists. Would you like to Overwrite?'
    //   );
    this.filesCurrentlyUploading = this.files.length;
    console.log(this.sendableFormData)
    // @ts-ignore
    for(var pair of this.sendableFormData.entries()) {
      console.log(pair[0]+ ', '+ pair[1]);
   }
   console.log(this.sendableFormData.getAll("zip"))
    this.files.forEach((file) => {
      file['overwrite'] = true 
      if(file['uploadStatus'] == "Already Exists"){
        file['overwrite'] = confirm(
           file.name +  ' already exists. Would you like to Overwrite?'
        );
      }
      console.log(file['overwrite'])
      if(file['overwrite'] === false ){
        console.log("CANCELED")
        file['uploadStatus'] = 'Canceled';
        file['errorMessage'] = file.name + ' was not uploaded to prevent overwrite';
        return;
      }
      file['uploadStatus'] = 'Inprogress';
      console.log(file)
      console.log(file.name)
      this.data.uploadService
      let fileFormData = new FormData()
      console.log(this.sendableFormData.getAll("zip").filter((f) => f["name"] == file.name))
      fileFormData.append("zip", this.sendableFormData.getAll("zip").filter((f) => f["name"] == file.name)[0])
      console.log(fileFormData.get('zip'))
      fileFormData.append('Domain_Id', this.data.ID);
      fileFormData.append('Domain_Domain', this.data.DomainDomain);
      this.data.uploadService
      .uploadFile(fileFormData, file['overwrite'])
      .subscribe(
        (resp) => {
          if (resp.type === HttpEventType.Response) {
              file['uploadStatus'] = 'Complete';
              this.filesCurrentlyUploading -= 1;
              if (this.filesCurrentlyUploading === 0) {
                this.dialogRef.close('fileUploaded');
              }
          }
          if (resp.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * resp.loaded) / resp.total);
            console.log("File: " + file.name + ' Progress ' + percentDone + '%');
          }
        },
        (failure) => {
          this.alertsSvc.alert(failure);
          file["errorMessage"] = failure.error.error
          file['uploadStatus'] = 'Failed';
        }
      );
    });

    // this.data.uploadService
    //   .uploadFile(this.sendableFormData, this.overwrite)
    //   .subscribe(
    //     (resp) => {
    //       if (resp.type === HttpEventType.Response) {
    //         this.files.forEach((file) => {
    //           file['uploadStatus'] = 'Complete';
    //           this.filesCurrentlyUploading -= 1;
    //           if (this.filesCurrentlyUploading === 0) {
    //             this.dialogRef.close('fileUploaded');
    //           }
    //         });
    //       }
    //       if (resp.type === HttpEventType.UploadProgress) {
    //         const percentDone = Math.round((100 * resp.loaded) / resp.total);
    //         console.log('Progress ' + percentDone + '%');
    //         this.files.forEach((file) => {
    //           file['uploadStatus'] = 'Inprogress';
    //         });
    //       }
    //     },
    //     (failure) => {
    //       this.alertsSvc.alert(failure);
    //     }
    //   );
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

  closeDialog() {
    if (this.filesCurrentlyUploading) {
      const dialogSettings = new ConfirmDialogSettings();
      dialogSettings.itemConfirming = 'Cancel File Upload?';
      dialogSettings.actionConfirming =
        `There is still ${this.filesCurrentlyUploading} file currently uploading. ` +
        `The upload process will continue in the background ` +
        `but the page may not automatically update with the new items`;

      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogSettings,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'confirmed') {
          console.log('closing');
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }
}
