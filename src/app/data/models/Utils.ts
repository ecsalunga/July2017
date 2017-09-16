export class NameValue {
    Name: string;
    Value: any;

    constructor(name: string, value: any){
        this.Name = name;
        this.Value = value;
    }
}

export class CommandInfo {
    key: string;
    UserKey: string;
    ComandType: string;
    Data: any;
}