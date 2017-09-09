export class UserInfo {
    key: string;
    Name: string;
    Email: string;
    UID: string;
    ImageURL: string;
    SystemImageURL: string;
    AccessKey: string;
    AccessName: string;
    Address1: string;
    Address2: string;
    Contact1: string;
    Contact2: string;
    JoinDate: number;
    IsSystemUser: boolean;
    IsMember: boolean;

    constructor(defaultImageURL: string) {
        this.SystemImageURL = defaultImageURL;
    }
}