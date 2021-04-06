import { BaseModel } from './base.model';

export class UserHistory {
  username: string;
  is_admin: boolean;
  status_code: number;
  path: string;
  method: string;
  args: any;
  json: any;
  created: Date;
  error: string;
}

export class UserModel extends BaseModel {
  APIKey: string;
  Attributes: [];
  Email: string;
  Enabled: boolean;
  Groups: [];
  HasAPIKey: string;
  History: Array<UserHistory>;
  UserCreateDate: Date;
  UserLastModifiedDate: Date;
  UserStatus: string;
  Username: string;
  UsernameLowereCase: string;
}
