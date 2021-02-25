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

export class AWSUserModel {
  Attributes: [];
  Enabled: boolean;
  UserCreateDate: Date;
  UserLastModifiedDate: Date;
  UserStatus: string;
  Username: string;
}

export class UserModel extends AWSUserModel {
  _id: string;
  Groups: [];
  HasAPIKey: string;
  Email: string;
  APIKey: string;
  History: Array<UserHistory>;
}
