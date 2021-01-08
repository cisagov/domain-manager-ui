export class ApplicationModel {
  _id: string;
  name: string;
  requester_name: string;
  created: Date;
  updated: Date;

  // Helper attributes
  domains_used_count: Number;

  constructor() {
    this._id = null;
    this.domains_used_count = 0;
    this.name = null;
    this.requester_name = null;
    this.created = null;
    this.updated = null;
  }
}
