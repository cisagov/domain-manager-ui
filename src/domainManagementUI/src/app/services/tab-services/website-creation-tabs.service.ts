import { BehaviorSubject } from 'rxjs';
import { EmailValidator, FormControl, FormGroup, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';

//Local Servie Imports
import { TemplateService } from 'src/app/services/template.service';
import { WebsiteService } from 'src/app/services/website.service';

//Models
import { environment } from 'src/environments/environment';
import { WebsiteModel, WebSiteParameter } from 'src/app/models/website.model';
import { TemplateAttribute } from 'src/app/models/template.model';

@Injectable({
    providedIn: 'root',
})
export class WebsiteCreationTabService{
    

    template_selection_form: FormGroup;
    attributes_form: FormGroup;

    public attribueList: Array<TemplateAttribute> = new Array<TemplateAttribute>();
    public tabCompleteBehvaiorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
    public templateSelectionBehaviorSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null)
    public website_data : WebsiteModel = new WebsiteModel();
    public website_data_behavior_subject: BehaviorSubject<WebsiteModel> = new BehaviorSubject<WebsiteModel>(new WebsiteModel());


    constructor(
        private router: Router,
        private websiteSvc: WebsiteService,
        private templateSvc: TemplateService,
    ) {
        this.getAllWebsites();
        this._rebuildForms();        
        this.website_data_behavior_subject.subscribe(
            (data) => {
                this.website_data = data;    
            }            
        )
    }

    getWebsiteDataBehaviorSubject(){
        return this.website_data_behavior_subject;
    }
    getTabCompleteBehviorSubject(){
        return this.tabCompleteBehvaiorSubject;
    }
    getTemplateUpdateBehvaiorSubject(){
        return this.templateSelectionBehaviorSubject;
    }

    _rebuildForms(){
        this.template_selection_form = new FormGroup(
            {
                template_uuid: new FormControl('', {validators: Validators.required})
            }
        )
        this._buildAttributesForm();
    }

    //If a new template is selcted and the attibutes form needs to be recreated
    _buildAttributesForm(){
        //Seperated out so attributes can be generated based on the template selected if that feature is implmemented
        this.templateSvc.getTemplateAttributes().subscribe(
            (success) => {
                this.attribueList = success as TemplateAttribute[]
            },
            (failure) => {
                console.log("failed to get attributes for the attributes tab")
            },
        )
        this.attributes_form = new FormGroup({
            application_using_uuid: new FormControl('', {validators: Validators.required}),
            website_name: new FormControl('', {validators: Validators.required})            
        })
        if(Array.isArray(this.attribueList)){
            this.attribueList.forEach((attribute) => {
                this.attributes_form.addControl(attribute.key, new FormControl('',Validators.required))                
            })
        }
        console.log(this.attributes_form)
    }

    //Updates template selection, used when redirectedfrom a template and it should be 
    //automatically selected
    updateTemplateSelection(template_uuid){
        this.templateSelectionBehaviorSubject.next(template_uuid);
    }

    getAllWebsites(){
        return this.templateSvc.getAllTemplates();
    }

    submitTab(form: FormGroup){
        if(this.isValid(form)){
            this.tabCompleteBehvaiorSubject.next(true)
        } else {
            console.log("form invalid")
        }
    }
    isValid(form: FormGroup){
        if(form.valid){
            return true;
        } else {
            form.markAllAsTouched();
            return false;
        }
    }
    createWebsite(){
        let newWebsite = new WebsiteModel();

        newWebsite.website_name = this.attributes_form.controls["website_name"].value;
        newWebsite.template_base_uuid = this.template_selection_form.controls["template_uuid"].value;
        newWebsite.application_using_uuid = this.attributes_form.controls["application_using_uuid"].value;
        
        let submittedAttributeList = new Array<WebSiteParameter>();
        this.attribueList.forEach((attribute) => {
            let newAtt = new WebSiteParameter();
            let submittedAtt = this.attributes_form.controls[attribute.key];

            newAtt.value =submittedAtt.value
            newAtt.param_name = attribute.key

            submittedAttributeList.push(newAtt)
        })
        newWebsite.website_parameters = submittedAttributeList;
        console.log(newWebsite)
        this.websiteSvc.createWebsite(newWebsite).subscribe(
            (success) => {
                console.log(success)
                this.router.navigate([`/website`]);
            },
            (failure) => {
                console.log("Failed to create website")
                console.log(failure);
            }
        )
    }
    

}
