import { NameValue, IStatus } from './';

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
    Source: string;
    IsDelivered: boolean;

    constructor() {
        this.IsDelivered = false;
    }
}

export class CancelInfo {
    UserKey: string;
    UserName: string;
    Description: string;
    Transaction: TransactionInfo;
    ActionDate: number;
    KeyMonth: number;
}

export class DeliveryInfo implements IStatus {
    key: string;
    UserKey: string;
    UserName: string;
    Transaction: TransactionInfo;
    Address: string;
    Contact: string;
    ActionStart: number;
    ActionDate: number;
    Status: string;
    IsTransaction: boolean;
    Actions: Array<NameValue>;

    constructor() {
        this.IsTransaction = false;
        this.Actions = new Array<NameValue>();
    }
}