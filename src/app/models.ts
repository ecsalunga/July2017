export class ProductInfo {
    key: string;
    Code: string;
    Description: string;
    BuyPrice: number;
    SellPrice: number;
    Quantity: number;
    NotifyQuantity: number;
    Status: number;
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
    Items: Array<SellInfo>;
    ActionDate: Date;
}

export class MemberInfo {
    key: string;
    Name: string;
    Address: string;
    Block: number;
    Lot: number;
    Contact1: string;
    Contact2: string;
    Contact3: string;
    JoinDate: Date;
    Status: number;
}