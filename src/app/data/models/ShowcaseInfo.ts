export class ScheduleInfo {
    From: number;
    To: number;
}

export class ShowcaseInfo {
    key: string;
    Code: string;
    Name: string;
    Description: string;
    Price: number;
    ImageURL: string;
    Schedules: Array<ScheduleInfo>;

    constructor(defaultImageURL: string) {
        this.Schedules = new Array<ScheduleInfo>();
        this.ImageURL = defaultImageURL;
    }
}