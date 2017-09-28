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

export class QuotaInfo {
    key: string;
    SubscriptionKey: string;
    SubscriptionName: string;
    ActionDate: number;
    From: number;
    To: number;
    Subscribers: Array<Name2Value>;
    Products: Array<PromoInfo>;
    Purchases: Array<PurchaseInfo>;

    constructor() {
        this.Subscribers = new Array<Name2Value>();
        this.Products = new Array<PromoInfo>();
        this.Purchases = new Array<PurchaseInfo>();
    }
}

export class PurchaseInfo {
    MemberKey: string;
    MemberName: string;
    HadQuota: boolean;
    items: Array<Name2Value>;

    constructor() {
        this.items = new Array<Name2Value>();
    }
}