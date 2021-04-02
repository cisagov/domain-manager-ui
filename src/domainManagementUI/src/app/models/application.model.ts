import { BaseModel } from './base.model';

export class ApplicationModel extends BaseModel {
  name: string;
  requester_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;

  // Helper attributes
  domains_used_count: Number;
}

export class ApplicationGroupModel extends ApplicationModel {
  isChecked: boolean;

  constructor() {
    super();
    this.isChecked = false;
  }
}
