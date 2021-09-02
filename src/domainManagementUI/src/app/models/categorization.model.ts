import { BaseModel } from './base.model';

export class CategorizationModel extends BaseModel {
  domain_id: string;
  proxy: string;
  status: string;
  category: string;
  categorize_url: string;
  check_url: string;
}
