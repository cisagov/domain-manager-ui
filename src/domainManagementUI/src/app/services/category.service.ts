import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategorizationModel } from '../models/categorization.model';

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

  getCategorizations(status: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/categorizations/?status=${status}/`;
    return this.http.get(url);
  }

  domainDetails(domainId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/`;
    return this.http.get(url);
  }

  externalDomainDetails(externalId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/external-domain/${externalId}/`;
    return this.http.get(url);
  }

  submitCategory(domainId: string, categoryName: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/categorize/`;
    return this.http.post(url, { category: categoryName });
  }

  checkCategory(domainId: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/categorize/`;
    return this.http.get(url);
  }

  updateDomainCategories(domainId: string, status: string, category: string) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/categorize/`;
    return this.http.put(url, { status: status, category: category });
  }

  updateCategorization(id: string, data: CategorizationModel) {
    const url = `${this.settingsService.settings.apiUrl}/api/categorization/${id}/`;
    return this.http.put(url, data);
  }

  deleteProxyRequests(domainId: string, data: object) {
    const url = `${this.settingsService.settings.apiUrl}/api/domain/${domainId}/categorize/`;
    return this.http.request('delete', url, { body: data });
  }

  deleteExternalProxyRequests(externalId: string, data: object) {
    const url = `${this.settingsService.settings.apiUrl}/api/external-domain/${externalId}/categorize/`;
    return this.http.request('delete', url, { body: data });
  }
}
