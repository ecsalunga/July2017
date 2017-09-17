import { ScheduleInfo } from './';

export class ServiceInfo {
    key: string;
    Code: string;
    Name: string;
    Description: string;
    Price: number;
    Order: number;
    ImageURL: string;
    Schedules: Array<ScheduleInfo>;

    constructor(defaultImageURL: string) {
        this.Schedules = new Array<ScheduleInfo>();
        this.ImageURL = defaultImageURL;
    }
}