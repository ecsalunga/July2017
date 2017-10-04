import { ScheduleInfo, NameValue, IStatus } from './';

export class ServiceInfo {
    key: string;
    Code: string;
    Name: string;
    Description: string;
    Price: number;
    Order: number;
    BookingType: string;
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
    FromHour: number;
    To: number;
    ItemKey: string;
    Name: string;
    Price: number;
    Count: number;
    ActionDate: number;
    Status: string;
    IsTransaction: boolean;
    BookingType: string;
    Note: string;
    Actions: Array<NameValue>;

    constructor() {
        this.IsTransaction = false;
        this.Actions =  new Array<NameValue>();
    }
}