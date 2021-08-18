import { BaseModel } from './base.model';

export class DomainEmailListModel extends BaseModel {
    from_address: string;
    is_read: boolean;
    subject: boolean;
    timestamp: string;
}
export class DomainEmailModel extends BaseModel {
    from_address: string;
    is_read: boolean;
    subject: boolean;
    timestamp: string;
    message: string;
    to_address: string;    
}
