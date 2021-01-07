export class ApplicationModel {
  _id: string;
  name: string;
  requester_name: string;
  created: Date;
  updated: Date;

  constructor() {
    this._id = null;
    this.name = null;
    this.requester_name = null;
    this.created = null;
    this.updated = null;
  }
}
