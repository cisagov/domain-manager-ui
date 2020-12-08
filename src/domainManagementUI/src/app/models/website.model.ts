export interface IWebsiteBaseModel {
  website_name: string;
  uuid: string;
}

export class WebsiteBaseModel {
  website_name: string;
  website_uuid: string;
  website_url: string;
  created_date: Date;
  template_base_name: string;
  template_base_uuid: string;
  website_parameters: WebSiteParameter[];

  constructor(){
    this.website_name = null;
    this.website_uuid = null;
    this.created_date = null;
    this.template_base_name = null;
    this.template_base_uuid = null;
    this.website_parameters = [];
  }
}

export class WebSiteParameter {
  param_name: string;
  value: string;
}

export class WebsiteModel extends WebsiteBaseModel {}
