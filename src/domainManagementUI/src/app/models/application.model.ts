export class ApplicationBaseModel {
  application_name: string;
  application_uuid: string;

  constructor() {
    this.application_name = null;
    this.application_uuid = null;
  }
}

export class ApplicationModel extends ApplicationBaseModel {
  domains_used_count: number;
  date_created: Date;
  requester_name: string;

  constructor() {
    super();
    this.domains_used_count = null;
    this.requester_name = null;
  }
}
