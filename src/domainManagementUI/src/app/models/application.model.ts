export class ApplicationBaseModel {
    
    application_name: string;
    application_uuid: string;
    domains_used_count: number;

    constructor(){
        this.application_name = null;
        this.application_uuid = null;
        this.domains_used_count = null;
    }
}

export class ApplicationModel extends ApplicationBaseModel {}
