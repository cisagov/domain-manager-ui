export interface IWebsiteBaseModel {
  counter: number;
  name: string;
  uuid: string;
}

export class WebsiteBaseModel {
  counter: number;
  name: string;
  uuid: string;
}

export class WebsiteModel extends WebsiteBaseModel {}
