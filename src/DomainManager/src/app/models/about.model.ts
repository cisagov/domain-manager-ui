import { BaseModel } from './base.model';

export class AboutModel extends BaseModel {
  ui_commit_id: string;
  api_commit_id: string;
  deployed_date: string;
}

export class SettingsModel {
  SES_FORWARD_EMAIL: string;
  USER_NOTIFICATION_EMAIL: string;
  CATEGORIZATION_EMAIL: string;
}
