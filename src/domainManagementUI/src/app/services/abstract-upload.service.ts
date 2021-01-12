import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractUploadService {

  constructor() { }

  abstract uploadFile(file:any) :any;
}
