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

    constructor() {
        this.Schedules = new Array<ScheduleInfo>();
        this.ImageURL = "https://firebasestorage.googleapis.com/v0/b/temp-system.appspot.com/o/images%2FNoImage.png?alt=media&token=40823113-df0a-4412-8026-d501036b9d78";
    }
}