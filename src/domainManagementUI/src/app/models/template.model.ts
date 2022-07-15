import { BaseModel } from './base.model';

export class TemplateModel extends BaseModel {
  name: string;
  nameLowerCase: string;
  s3_url: string;
  is_approved: boolean;
  createdByLowerCase: string;
  updatedByLowerCase: string;
  template_attributes: Array<TemplateAttribute>;
  selected: boolean;
  is_go_template = true;
}

export class TemplateAttribute {
  key: string;
  value: string;
  place_holder: string;
}
