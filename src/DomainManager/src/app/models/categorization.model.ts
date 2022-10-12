export interface CategorizationModel {
  _id?: string;
  created?: Date;
  created_by?: string;
  updated?: Date;
  updated_by?: string;
  domain_id?: string;
  domain_name?: string;
  is_external?: boolean;
  proxy?: string;
  status?: string;
  category?: string;
  categorize_url?: string;
  check_url?: string;
}
