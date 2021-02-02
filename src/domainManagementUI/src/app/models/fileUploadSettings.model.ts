import { AbstractUploadService } from '../services/abstract-upload.service';

export class FileUploadSettings {
  uploadType: string; //Display String
  uploadFileType: string = '*'; //The html [accept] attribute example = "application/zip" or "text.html"

  multipleFileUpload: boolean = true;
  uploadService: AbstractUploadService;
  ID: string;
  DomainDomain: string;
}
