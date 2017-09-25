import { SellInfo } from './';

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
    Borrows: Array<BorrowInfo>;
    Sells: Array<SellInfo>;
    ActionDate: number;
    IsSystemUser: boolean;
    IsMember: boolean;

    constructor(defaultImageURL: string) {
        this.SystemImageURL = defaultImageURL;
    }
}

export class BorrowInfo {
    Code: string;
    Name: string;
    BorrowType: string;
    Count: number;
    ActionDate: number;
    ReturnDate: number;
}