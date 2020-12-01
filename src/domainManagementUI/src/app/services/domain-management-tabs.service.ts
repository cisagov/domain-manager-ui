import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Observable } from 'rxjs';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class DomainManagementService {
  // Test Data
  domainDetails = [
      {
          name: "MyDomain",
          uuid: "MyDomainDetailUUID",
      }
  ]

  constructor(
    private settingsService: SettingsService
  ) {}
}
