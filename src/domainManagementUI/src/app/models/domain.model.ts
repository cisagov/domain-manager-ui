export interface IDomainBaseModel {
  CallerReference: string;
  Id: string;
  Name: string;
  ResourceRecordSetCount: number;
  _id: string;
}

export class DomainBaseModel {
  CallerReference: string;
  Id: string;
  Name: string;
  ResourceRecordSetCount: number;
  RegistrarName: string;
  CategoryOne: string;
  CategoryTwo: string;
  CategoryThree: string;
  RegisteredOnMailgun: string;
  RegisteredOnPublicWeb: string;
  PurchasedDate: Date;
  StandupDate: Date;
  _id: string;
}

export class DomainModel extends DomainBaseModel {
  constructor() {
    super();
    this._id = null;
    this.CallerReference = null;
    this.Id = null;
    this.Name = null;
    this.ResourceRecordSetCount = 0;
    this.RegistrarName = null;
    this.CategoryOne = null;
    this.CategoryTwo = null;
    this.CategoryThree = null;
    this.RegisteredOnMailgun = null;
    this.RegisteredOnPublicWeb = null;
    this.PurchasedDate = null;
    this.StandupDate = null;
    this._id = null;
  }
}
