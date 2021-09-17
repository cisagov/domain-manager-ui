// Angular Imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Local Service Imports
import { SettingsService } from 'src/app/services/settings.service';

@Injectable()
export class ForgotPasswordService {
  apiUrl: string;
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    this.apiUrl = this.settingsService.settings.apiUrl;
  }

  public triggerPasswordReset(username: string): Observable<any> {
    const url = `${this.settingsService.settings.apiUrl}/api/auth/resetpassword/${username}/`;
    return this.http.get(url);
  }
}
