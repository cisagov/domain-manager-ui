export class ApplicationModel {
  _id: string;
  name: string;
  requester_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  created: Date;
  updated: Date;

  // Helper attributes
  domains_used_count: Number;
}

export class ApplicationGroupModel extends ApplicationModel {
  isChecked: boolean;

  constructor(){
    super()
    this.isChecked = false;
  }
}
