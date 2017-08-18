export class ProductInfo {
    key: string;
    Code: string;
    Description: string;
    BuyPrice: number;
    SellPrice: number;
    Quantity: number;
    QuantityNotify: number;
}

export class MemberInfo {
    key: string;
    Name: string;
    Address1: string;
    Address2: string;
    Address3: string;
    Contact1: string;
    Contact2: string;
    Contact3: string;
    JoinDate: number;
}

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
}

export class QueryInfo {
    KeyDay: number;
    KeyMonth: number;
    KeyYear: number;
    Count: number;
    Amount: number;
}

export class ReportInfo {
    key: string;
    KeyDay: number;
    KeyMonth: number;
    Count: number;
    Amount: number;
}