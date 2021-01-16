import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractUploadService {

  constructor() { }

/* the whole thing looks like 
    check the validation client side
    if the file name exists prompt for overwrite
    if the file is overwrite on the api side delete the existing template first
    then upload
    else 
      return error back to the client      
*/
  //here is the contract
  //first you must call the get validation data 
  //to retrieve any data that is needed for validation
  //second call validatebeforeupload on the retrieved validation data 
  //and data to be uploaded
  //third attempt to upload the files
  //fourth check results to see if the upload was successful
  //it is still possible that it was not

  abstract preloadValidationData();  
  abstract uploadFile(file:any,overwrite:boolean) :any;  
  abstract validateBeforeUpload(validateData:any):any[];
}
