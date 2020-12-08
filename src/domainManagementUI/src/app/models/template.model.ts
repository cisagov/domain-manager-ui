export class TemplateBaseModel {
template_name: string;
template_uuid: string;
created_date: Date;
uploaded_by: string;
template_url: string;

    constructor(){
        this.template_name = null;
        this.template_uuid = null;
        this.uploaded_by = null;
        this.created_date = null;
        this.template_url = null;
    }
}

export class TemplateModel extends TemplateBaseModel {}
