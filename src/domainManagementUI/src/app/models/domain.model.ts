export class DomainBaseModel {
  callerReference: string;
  id: string;
  name: string;
  application: string;
  isAvailable: boolean;
  lastUser: string;
  reputation: number;
  resourceRecordSetCount: number;
  registrarName: string;
  categoryOne: string;
  categoryTwo: string;
  categoryThree: string;
  registeredOnMailgun: string;
  registeredOnPublicWeb: string;
  expirationDate: Date;
  wentLiveDate: Date;
  _id: string;
}

export class DomainListItemModel extends DomainBaseModel {
  isSelected: boolean = false
}

export class DomainModel extends DomainBaseModel {  
  constructor(){
    super();
    this._id = null;
    this.callerReference = null;
    this.id = null;
    this.name = null;
    this.resourceRecordSetCount = 0;
    this.registrarName = null;
    this.categoryOne = null;
    this.categoryTwo = null;
    this.categoryThree = null;
    this.registeredOnMailgun = null;
    this.registeredOnPublicWeb = null;
    this.expirationDate = null;
    this.wentLiveDate = null;
    this._id = null;
  }
}
