import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Observable } from 'rxjs';

//Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { environment } from 'src/environments/environment';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class CategoryService {
  category_list = new Array();

  category_list_testing_data = [
    {
      name: 'Internets',
      _id: 'UUID-1',
    },
    {
      name: 'Websites',
      _id: 'UUID-2',
    },
    {
      name: 'SearchEngines',
      _id: 'UUID-3',
    },
    {
      name: 'Video Hosting Sites',
      _id: 'UUID-4',
    },
    {
      name: 'News',
      _id: 'UUID-5',
    },
    {
      name: 'Streaming Service',
      _id: 'UUID-6',
    },
  ];

  constructor(
    public alertsSvc: AlertsService,
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    this.getAllCategories();
  }

  getAllCategories() {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/categories/`;

    if (!environment.localData) {
      this.http.get(url, headers).subscribe(
        (success) => {
          this.category_list = success as [];
          console.log(this.category_list);
        },
        (failure) => {
          this.alertsSvc.alert('Failed to get category list');
          console.log(failure);
        }
      );
    }
  }

  getCategroyNameByUUID(uuid) {
    if (this.category_list.length) {
      return this.category_list.find((c) => c._id === uuid)?.name;
    }
    return 'ERROR';
  }
}
