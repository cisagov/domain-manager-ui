// Angular Imports
import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ngfModule, ngf } from 'angular-file';
import {
  HttpClient, HttpClientModule, HttpRequest, HttpResponse, HttpEvent, HttpEventType
} from "@angular/common/http"
import { NgModule } from "@angular/core"
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"
import { BrowserModule } from '@angular/platform-browser'
import { Subscription } from 'rxjs'
// Models
import { FileUploadSettings } from 'src/app/models/fileUploadSettings.model';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'file-upload-dialog',
  templateUrl: 'file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss'],
})
export class FileUploadDialogComponent {
  uploadType = 'File';
  uploadFileType = '*';

  uploadProcessed = false;
  filesCurrentlyUploading = 0;

  //ngf specific variables
  files: File[] = [];
  postName: String[] = [];
  progress: number;
  hasBaseDropZoneOver: boolean = false;
  lastFileAt: Date;
  sendableFormData: FormData; //populated via ngfFormData directive
  dragFiles: any;
  validComboDrag: any;
  lastInvalids: any;
  fileDropDisabled: any;
  multiple: boolean;
  maxSize: any;
  baseDropValid: any;
  httpEvent:HttpEvent<{}>
  uploadPercent: number;
  fileCounter = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FileUploadSettings,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<FileUploadDialogComponent>,
    public HttpClient:HttpClient
  ) {
    dialogRef.disableClose = true;
    console.log(data);
    this.uploadFileType = this.getNativeMimeType(data.uploadFileType);
  }
  
  uploadFiles() {    
    //TODO: This is currently iterating over all files for 
    //all files need to change it to only do 1 file at a time
    this.uploadProcessed = true;
    // this.files.forEach((file) => {
    //   if (file['uploadStatus'] != 'Complete') {
    //     this.filesCurrentlyUploading += 1;
    //     file['uploadStatus'] = 'Inprogress';
    //     if(this.sendableFormData.has("zip"))
    //       this.sendableFormData.set("zip", file, file.name);
    //     else
    //       this.sendableFormData.append("zip",file,file.name);        
        
    this.data.uploadService.uploadFile(this.sendableFormData,true).subscribe(
      resp => {
        if (resp.type === HttpEventType.Response) {                
            console.log('Upload complete');
        }
        if (resp.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * resp.loaded / resp.total);
            console.log('Progress ' + percentDone + '%');
        } 
      });
        //   (success) => {
        //     //file['uploadStatus'] = 'Complete';
        //     console.log("success");
        //   },
        //   (failure) => {
        //     //file['uploadStatus'] = 'Failed';
        //     console.log(failure);
        //   }
        // ); 
        
        
    //   }      
    // });
  }

  fileAdded(){    
    do{
      this.postName.push("zip"+this.fileCounter++);
    }while(this.fileCounter <this.files.length);
    this.lastFileAt = this.getDate();
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
