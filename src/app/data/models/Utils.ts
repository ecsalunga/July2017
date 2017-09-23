export interface IStatus {
    ActionDate: number;
    Status: string;
    Actions: Array<NameValue>;
}

export class NameValue {
    Name: string;
    Value: any;

    constructor(name: string, value: any){
        this.Name = name;
        this.Value = value;
    }
}

export class Name2Value {
    Name: string;
    Value1: any;
    Value2: any;

    constructor(name: string, value1: any, value2: any){
        this.Name = name;
        this.Value1 = value1;
        this.Value2 = value2;
    }
}

export class ScheduleInfo {
    From: number;
    To: number;
}

export class CommandInfo {
    key: string;
    UserKey: string;
    ComandType: string;
    Data: any;
}