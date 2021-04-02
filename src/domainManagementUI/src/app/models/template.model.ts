import { BaseModel } from './base.model';

export class TemplateModel extends BaseModel {
  name: string;
  s3_url: string;
  is_approved: boolean;

  template_attributes: Array<TemplateAttribute>;
}

export class TemplateAttribute {
  key: string;
  value: string;
  place_holder: string;
}
