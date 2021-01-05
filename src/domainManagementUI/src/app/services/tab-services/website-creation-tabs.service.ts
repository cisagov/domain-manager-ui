import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

//Local Servie Imports
import { TemplateService } from 'src/app/services/template.service';
import { WebsiteService } from 'src/app/services/website.service';

//Models
import { environment } from 'src/environments/environment';
import { WebsiteModel } from 'src/app/models/website.model';
import { TemplateModel } from 'src/app/models/template.model';

@Injectable()
export class WebsiteCreationTabService{
    
    public website_data : WebsiteModel = new WebsiteModel();
    public website_data_behavior_subject: BehaviorSubject<WebsiteModel> = new BehaviorSubject<WebsiteModel>(new WebsiteModel());


    constructor(
        private settingsService: SettingsService,
        private websiteSvc: WebsiteService,
        private templateSvc: TemplateService,
    ) {
        this.website_data_behavior_subject.subscribe(
            (data) => {
                this.website_data = data;    
            }            
        )
    }

    getWebsiteDataBehaviorSubject(){
        return this.website_data_behavior_subject;
    }

    getAllWebsites(){
        return this.templateSvc.getAllTemplates();
    }
}
