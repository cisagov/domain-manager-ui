// Angular Imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

// Models
import { EmailModel } from 'src/app/models/email.model';

@Injectable()
export class EmailService {
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  getDomainEmails(domainId) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/emails/`;
    return this.http.get(url);
  }

  getDomainEmail(emailId) {
    const url = `${this.settingsService.settings.apiUrl}/api/email/${emailId}/`;
    return this.http.get(url);
  }

  setDomainEmailsStatus(domainId, isActive) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/receive-emails/`;
    if (isActive) {
      return this.http.get(url);
    } else {
      return this.http.delete(url);
    }
  }
}
