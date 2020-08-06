export interface IDomainUtilizationBaseModel {
  counter: number;
  name: string;
  uuid: string;
}

export class DomainUtilizationBaseModel {
  counter: number;
  name: string;
  uuid: string;
}

export class DomainUtilizationModel extends DomainUtilizationBaseModel {}
