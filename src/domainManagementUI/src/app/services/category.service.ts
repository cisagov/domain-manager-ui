import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { AlertsService } from 'src/app/services/alerts.service';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class CategoryService {
  categories = {};

  constructor(
    public alertsSvc: AlertsService,
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    this.getAllCategories();
  }

  getAllCategories() {
    const url = `${this.settingsService.settings.apiUrl}/api/categories/`;
    this.http.get(url).subscribe(
      (success) => {
        this.categories = success as {};
      },
      (failure) => {
        this.alertsSvc.alert('Failed to get category list');
        console.log(failure);
      }
    );
  }

  submitCategory(domainId: string, categoryName: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/categorize/`;
    return this.http.post(url, { category: categoryName });
  }

  checkCategory(domainId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/categorize/`;
    return this.http.get(url);
  }

  manuallyCategorize(domainId: string, proxy: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/categorize/`;
    return this.http.put(url, { proxy });
  }
}
