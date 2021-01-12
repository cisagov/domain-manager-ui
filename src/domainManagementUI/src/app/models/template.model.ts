export class TemplateBaseModel {
  name: string;
  _id: string;
  created: Date;
  uploaded_by: string;
  s3_url: string;

  constructor() {
    this.name = null;
    this._id = null;
    this.uploaded_by = null;
    this.created = null;
    this.s3_url = null;
  }
}

export class TemplateAttribute {
  key: string;
  value: string;
  place_holder: string;
  constructor() {
    this.key = null;
    this.value = null;
    this.place_holder = null;
  }
}

export class TemplateModel extends TemplateBaseModel {
  template_attributes: Array<TemplateAttribute>;

  constructor() {
    super();
    this.template_attributes = new Array<TemplateAttribute>();
  }
}
