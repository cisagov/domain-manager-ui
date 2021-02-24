export class UserAction {
  Action: string;
  Time: Date;
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
  History: Array<UserAction>;
}
