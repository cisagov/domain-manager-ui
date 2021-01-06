import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

//Local Servie Imports
import { WebsiteService } from 'src/app/services/website.service'

//Models
import { environment } from 'src/environments/environment';
import { WebsiteModel, WebsiteHistory } from 'src/app/models/website.model'


const headers = {
  headers: new HttpHeaders().set('Content-Type', 'application/json'),
};

@Injectable()
export class WebsiteDetailsTabService{
    
    public website_data : WebsiteModel = new WebsiteModel();
    public website_data_behavior_subject: BehaviorSubject<WebsiteModel> = new BehaviorSubject<WebsiteModel>(new WebsiteModel());
    public website_history : WebsiteHistory[] = new Array<WebsiteHistory>();

    constructor(
        private http: HttpClient,
        private settingsService: SettingsService,
        private websiteSvc: WebsiteService,
    ) {
        this.website_data_behavior_subject.subscribe(
            (data) => {
                this.website_data = data;                
                this.initalizeData();
            }            
        )
    }

    getWebsiteDataBehaviorSubject(){
        return this.website_data_behavior_subject;
    }

    getWebsiteDetails(website_uuid) {
        this.website_data = new WebsiteModel();
        console.log(website_uuid)
        this.websiteSvc
        .getWebsiteDetails(website_uuid)
        .subscribe(
            (success) => {
            //TODO: Remove timeoutsection that is being used for testing pre -API
                setTimeout(() => {
                    this.website_data = success as WebsiteModel;
                    this.website_data_behavior_subject.next(this.website_data)
                    this.initalizeData();
                },700)
            },
            (error) => {
                console.log(`Error from service ${error}`);
            }
        );
    }
    getWebsiteHistory(website_uuid){
        this.website_history = new Array<WebsiteHistory>();
        this.websiteSvc
        .getWebsiteHistory(website_uuid)
        .subscribe(
            (success) => {
                this.website_history = success as WebsiteHistory[]
            },
            (failure) => {
                console.log("FAILED TO LOAD WEBSITE HISTORY")
            }
        )
    }

    initalizeData(){

    }

    downloadWebsite(uuid){
        this.websiteSvc.downloadWebsite(uuid);
    }

}
