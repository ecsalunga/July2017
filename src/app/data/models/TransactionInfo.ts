import { NameValue } from './';

export class SellInfo {
    key: string;
    Code: string;
    Description: string;
    Quantity: number;
    Price: number;
    Total: number;
    ForDelete: boolean;
}

export class TransactionInfo {
    key: string;
    MemberKey: string;
    BuyerName: string;
    UserKey: string;
    UserName: string;
    Items: Array<SellInfo>;
    Count: number;
    Amount: number;
    ActionDate: number;
    KeyDay: number;
}

export class DeliveryInfo {
    key: string;
    UserKey: string;
    UserName: string;
    Transaction: TransactionInfo;
    Address: string;
    Contact: string;
    ActionStart: number;
    ActionLast: number;
    Status: string;
    IsTransaction: boolean;
    Actions: Array<NameValue>;

    constructor() {
        this.IsTransaction = false;
        this.Actions = new Array<NameValue>();
    }
}