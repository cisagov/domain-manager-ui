export class DomainBaseModel {
  callerReference: string;
  id: string;
  uuid: string;
  name: string;
  application: string;
  application_uuid: string;
  isAvailable: boolean;
  lastUser: string;
  reputation: number;
  resourceRecordSetCount: number;
  registrarName: string;
  categoryOne: string;
  categoryTwo: string;
  categoryThree: boolean;
  createMailgun: boolean;
  createSES: boolean;
  registeredOnPublicWeb: string;
  expirationDate: Date;
  wentLiveDate: Date;
  useHistory: DomainHistory[];
  website_uuid: string;
  update_email: string;
  _id: string;

  constructor() {
    this._id = null;
    this.uuid = null;
    this.callerReference = null;
    this.id = null;
    (this.application = null),
      (this.application_uuid = null),
      (this.isAvailable = null),
      (this.lastUser = null),
      (this.reputation = null),
      (this.name = null);
    this.resourceRecordSetCount = 0;
    this.registrarName = null;
    this.categoryOne = null;
    this.categoryTwo = null;
    this.categoryThree = null;
    this.createMailgun = false;
    this.createSES = false;
    this.registeredOnPublicWeb = null;
    this.expirationDate = null;
    this.wentLiveDate = null;
    this.useHistory = [];
    this.website_uuid = null;
    this.update_email = null;
  }
}

class DomainHistory {
  applicationThatUsed: string;
  startDate: Date;
  stopDate: Date;
}

export class DomainModel extends DomainBaseModel {}

export class DomainListItemModel extends DomainModel {
  isSelected: boolean;

  constructor() {
    super();
    this.isSelected = false;
  }
}
