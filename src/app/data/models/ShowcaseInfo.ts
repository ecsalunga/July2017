import { ProductInfo, SellInfo, NameValue } from './index';

export class ScheduleInfo {
    From: number;
    To: number;
}

export class OrderInfo {
    key: string;
    MemberKey: string;
    BuyerName: string;
    Items: Array<SellInfo>;
    Count: number;
    Amount: number;
    ActionDate: number;
    Status: string;
    Actions: Array<NameValue>;

    constructor() {
        this.Items = new Array<SellInfo>();
        this.Actions =  new Array<NameValue>();
    }
}

export class ShowcaseInfo {
    key: string;
    Product: ProductInfo;
    Description: string;
    Order: number;
    MaxCart: number;
    ImageURL: string;
    Schedules: Array<ScheduleInfo>;

    constructor(defaultImageURL: string) {
        this.Schedules = new Array<ScheduleInfo>();
        this.ImageURL = defaultImageURL;
    }
}