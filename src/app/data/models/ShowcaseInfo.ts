import { ProductInfo, SellInfo, NameValue, ScheduleInfo, IStatus } from './';

export class OrderInfo implements IStatus {
    key: string;
    MemberKey: string;
    BuyerName: string;
    Items: Array<SellInfo>;
    Count: number;
    Amount: number;
    ActionDate: number;
    Status: string;
    HasDelivery: boolean;
    IsTransaction: boolean;
    Actions: Array<NameValue>;

    constructor() {
        this.HasDelivery = false;
        this.IsTransaction = false;
        this.Items = new Array<SellInfo>();
        this.Actions =  new Array<NameValue>();
    }
}

export class ShowcaseInfo {
    key: string;
    ProductCode: string;
    ProductName: string;
    ProductPrice: number;
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