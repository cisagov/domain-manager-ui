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

export class TemplateAttribute {
    key: string;
    value: string;
    place_holder: string;
    constructor(){
        this.key = null;
        this.value = null;
        this.place_holder = null;
    }
}

export class TemplateModel extends TemplateBaseModel {
    template_attributes: Array<TemplateAttribute>;

    constructor(){
        super();
        this.template_attributes = new Array<TemplateAttribute>();
    }   

}
