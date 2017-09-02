import { NameValue } from './NameValue';

export class SellInfo {
    key: string;
    Code: string;
    Description: string;
    Quantity: number;
    Price: number;
    Total: number;
}

export class TransactionInfo {
    key: string;
    MemberKey: string;
    BuyerName: string;
    Items: Array<SellInfo>;
    Count: number;
    Amount: number;
    ActionDate: number;
    KeyDay: number;
    IsDelivery: boolean;
}

export class DeliveryInfo {
    key: string;
    UserKey: string;
    UserName: string;
    Transaction: TransactionInfo;
    ActionStart: number;
    ActionLast: number;
    Status: string;
    Actions: Array<NameValue>;

    constructor() {
        this.Actions = new Array<NameValue>();
    }
}