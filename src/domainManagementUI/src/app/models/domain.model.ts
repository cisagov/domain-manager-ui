import { ApplicationModel } from './application.model';
import { BaseModel } from './base.model';

export class DomainModel extends BaseModel {
  name: string;
  nameLowerCase: string;
  s3_url: string;
  launch_date: Date;
  template_base_name: string;
  template_base_name_lower_case: string;
  template_base_uuid: string;
  template_name: string;
  domain_parameters: WebSiteParameter[];
  application_name: string;
  application_name_lower_case: string;
  application_id: string;
  is_active: boolean;
  is_approved: boolean;
  application_using: ApplicationModel;
  history: DomainHistoryModel[];
  route53: string;
  hosted_zones: HostedZoneModel[];
  redirects: RedirectModel[];
  records: RecordModel[];
  //Status Flags
  is_available: boolean;
  is_launching: boolean;
  is_delaunching: boolean;
  is_generating_template: boolean;
  cloudfront_status: any;

  // Categorization
  category_results: CategoryResult[];
  submitted_category: string;
}

export class CategoryResult {
  proxy: string;
  is_submitted: boolean;
  submitted_category: string;
  categorize_url: string;
  check_url: string;
  category: string;
  manually_submitted: boolean;
}

export class HostedZoneModel {
  Name: string;
  ResourceRecords: Array<any>;
  AliasTarget: AliasTargetModel;
  TTL: number;
  Type: string;
}

export class AliasTargetModel {
  DNSName: string;
  EvaluateTargetHealth: boolean;
  HostedZoneId: string;
}

export class WebSiteParameter {
  param_name: string;
  value: string;
}

export class DomainHistoryModel {
  application: ApplicationModel;
  launch_date: Date;
}

export class RedirectModel {
  subdomain: string;
  redirect_url: string;
  protocol: string;
}

export class RecordModel {
  record_id: string;
  record_type: string;
  ttl = 60;
  name: string;
  config: any = {};
}
