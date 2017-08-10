export class ProductInfo {
    key: string;
    Code: string;
    Description: string;
    BuyPrice: number;
    SellPrice: number;
    Quantity: number;
    Status: number;  
}

export class SellInfo {
    ProductCode: string;
    Quantity: number;

    constructor(productCode: string, quntity: number){
        this.ProductCode = productCode;
        this.Quantity = quntity;
    }
}

export class TransactionInfo {
    key: string;
    MemberKey: string;
    Items: Array<SellInfo>;
    Date: string;
}

export class MemberInfo {
    key: string;
    Name: string;
    Address: string;
    Block: number;
    Lot: number;
    JoinDate: string;
    Status: number;
}

export class ContactInfo {
    key: string;
    MemberKey: string;
    Contact: string;
}