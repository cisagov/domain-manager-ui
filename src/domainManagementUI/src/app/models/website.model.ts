import { TemplateModel } from './template.model';
import { ApplicationModel } from './application.model';

export interface IWebsiteBaseModel {
  name: string;
  uuid: string;
}

export class WebsiteBaseModel {
  name: string;
  _id: string;
  s3_url: string;
  created_date: Date;
  launch_date: Date;
  template_base_name: string;
  template_base_uuid: string;
  category: string;
  // template: TemplateModel;
  website_parameters: WebSiteParameter[];
  application_id: string;
  is_active: boolean;
  application_using: ApplicationModel;
  history: WebsiteHistoryModel[];
  // route53: string[];
  route53: any;

  constructor() {
    this.name = null;
    this._id = null;
    this.created_date = null;
    this.launch_date = null;
    this.s3_url = null;
    this.category = null;
    this.template_base_name = null;
    this.template_base_uuid = null;
    // this.template = new TemplateModel();
    this.website_parameters = [];
    this.application_id = null;
    this.application_using = new ApplicationModel();
    this.is_active = null;
    this.history = new Array<WebsiteHistoryModel>();
    // this.route53 = new Array<string>();
    this.route53 = null;
  }
}

export class WebSiteParameter {
  param_name: string;
  value: string;
}

export class WebsiteModel extends WebsiteBaseModel {}

export class WebsiteHistoryModel {
  application: ApplicationModel;
  launch_date: Date;

  constructor() {
    this.application = new ApplicationModel();
    this.launch_date = null;
  }
}
