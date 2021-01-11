export class FileUploadSettings {
  uploadType: string; //Display String
  uploadFileType: string = '*'; //The html [accept] attribute example = "application/zip" or "text.html"
  uploadFunction: any; // Pass in the function that is used to upload the specified file type
  multipleFileUpload: boolean = false;
}
