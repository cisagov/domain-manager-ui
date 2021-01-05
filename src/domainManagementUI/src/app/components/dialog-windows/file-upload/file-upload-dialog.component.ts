
// Angular Imports
import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ngfModule, ngf } from "angular-file"

// Models
import { FileUploadSettings } from 'src/app/models/fileUploadSettings.model';

@Component({
    selector: 'file-upload-dialog',
    templateUrl: 'file-upload-dialog.component.html',
    styleUrls: ['./file-upload-dialog.component.scss'],
  })
  export class FileUploadDialogComponent {

    uploadType = "File" 
    uploadFileType = "*"
    uploadFunction = null

    uploadProcessed = false;
    filesCurrentlyUploading = 0;    

    //ngf specific variables
    files:File[] = []
    progress:number
    hasBaseDropZoneOver:boolean = false
    lastFileAt:Date    
    sendableFormData:FormData//populated via ngfFormData directive
    dragFiles:any
    validComboDrag:any
    lastInvalids:any
    fileDropDisabled:any
    maxSize:any
    baseDropValid:any

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: FileUploadSettings,
        public dialog: MatDialog,
        private dialogRef: MatDialogRef<FileUploadDialogComponent>,
      ) { 
        dialogRef.disableClose = true;
        this.uploadType = data.uploadType
        this.uploadFunction = data.uploadFunction
        this.uploadFileType = data.uploadFileType
      }


      uploadFiles(){  
          console.log(this.uploadFunction)
          this.uploadProcessed = true
          console.log(this.files)      
          this.files.forEach(file => {
              if(file["uploadStatus"] != "Complete"){
                this.filesCurrentlyUploading += 1;
                file["uploadStatus"] = "Inprogress"
                this.uploadFunction(file).subscribe(
                    (success) => {
                        file["uploadStatus"] = "Complete"
                    },
                    (failure) => {
                        file["uploadStatus"] = "Failed"
                        console.log(failure)
                    }
                )
              }
          });
      }

    
      getDate(){
        return new Date()
      }

  }