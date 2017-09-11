import { ProductInfo } from './ProductInfo';

export class ScheduleInfo {
    From: number;
    To: number;
}

export class ShowcaseInfo {
    key: string;
    Product: ProductInfo;
    Description: string;
    ImageURL: string;
    Schedules: Array<ScheduleInfo>;

    constructor(defaultImageURL: string) {
        this.Schedules = new Array<ScheduleInfo>();
        this.ImageURL = defaultImageURL;
    }
}