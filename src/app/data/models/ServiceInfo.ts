import { ScheduleInfo, NameValue, IStatus } from './';

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

export class ReservationInfo implements IStatus {
    key: string;
    MemberKey: string;
    MemberName: string;
    From: number;
    To: number;
    ItemKey: string;
    Name: string;
    Price: number;
    Count: number;
    ActionDate: number;
    Status: string;
    IsTransaction: boolean;
    Actions: Array<NameValue>;

    constructor() {
        this.IsTransaction = false;
        this.Actions =  new Array<NameValue>();
    }
}