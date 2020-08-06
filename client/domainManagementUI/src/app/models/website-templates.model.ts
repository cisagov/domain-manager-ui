export interface IWebsiteTemplateBaseModel {
  counter: number;
  name: string;
  uuid: string;
}

export class WebsiteTemplateBaseModel {
  counter: number;
  name: string;
  uuid: string;
}

export class WebsiteTemplateModel extends WebsiteTemplateBaseModel {}
