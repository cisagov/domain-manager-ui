import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Observable } from 'rxjs';

const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class CategoryService {

  category_list = new Array()

  category_list_testing_data = [
    { 
        categoryName: 'Internets',
        categoryUUID: 'UUID-1'
    },
    { 
        categoryName: 'Websites',
        categoryUUID: 'UUID-2'
    },
    { 
        categoryName: 'SearchEngines',
        categoryUUID: 'UUID-3'
    },
    { 
        categoryName: 'Video Hosting Sites',
        categoryUUID: 'UUID-4'
    },
    { 
        categoryName: 'News',
        categoryUUID: 'UUID-5'
    },
    { 
        categoryName: 'Streaming Service',
        categoryUUID: 'UUID-6'
    },
]

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    //TODO: REMOVE AFTER TESTING
    this.category_list = this.category_list_testing_data

  }

  getAllCategories() {
    //Example url, needs to be changed when API is in place
    let url = `${this.settingsService.settings.apiUrl}/api/templates/`;
    // return this.http.get(url,headers).subscribe(
    //   (success) => {
    //     this.template_list = success as Array<TemplateModel>;
    //   },
    //   (error) => {
    //     console.log(`Error from service ${error}`);
    //   }
    // );

    //Test Data TODO: REMOVE IN PROD
    return this.category_list
      
  }
}
