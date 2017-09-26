import { Name2Value, ScheduleInfo } from './';

export class SubscriptionInfo {
    key: string;
    Code: string;
    Name: string;
    Price: number;
    Description: string;
    Products: Array<PromoInfo>;
    Subscribers: Array<Name2Value>;
    ImageURL: string;
    
    constructor(defaultImageURL: string) {
        this.Subscribers = new Array<Name2Value>();
        this.Products = new Array<PromoInfo>();
        this.ImageURL = defaultImageURL;
    }
}

export class PromoInfo {
    Code: string;
    Name: string;
    Price: number;
    Quota: number;
}