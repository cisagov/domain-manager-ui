export class UserModel {
    name: string;
    _id: string;
    created: Date;
    is_activated: boolean;
    groups: Array<UserGroupModel>;
  
    constructor() {
      this.name = null;
      this._id = null;
      this.is_activated = false;
      this.created = null;
      this.groups = [];
    }
  }

  export class UserGroupModel {
      name: string;
      aws_id: string;
  }