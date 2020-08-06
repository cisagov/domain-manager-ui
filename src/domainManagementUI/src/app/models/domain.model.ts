export interface IDomainBaseModel {
  counter: number;
  name: string;
  uuid: string;
}

export class DomainBaseModel {
  counter: number;
  name: string;
  uuid: string;
}

export class DomainModel extends DomainBaseModel {}
