import { Name2Value, ScheduleInfo } from './';

export class SubscriptionInfo {
    key: string;
    Code: string;
    Name: string;
    Price: number;
    Description: string;
    Prices: Array<Name2Value>;
    Schedules: Array<ScheduleInfo>;
    Subscribers: Array<Name2Value>;
    ImageURL: string;
    
    constructor(defaultImageURL: string) {
        this.Subscribers = new Array<Name2Value>();
        this.Prices = new Array<Name2Value>();
        this.Schedules = new Array<ScheduleInfo>();
        this.ImageURL = defaultImageURL;
    }
}