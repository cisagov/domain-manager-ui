export class ApplicationModel {
  _id: string;
  name: string;
  requester_name: string;
  created: Date;
  updated: Date;

  // Helper attributes
  domains_used_count: Number;
}
