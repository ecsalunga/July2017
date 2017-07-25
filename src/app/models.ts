export class ProductInfo {
    Code: string;
    Description: string;
    BuyPrice: number;
    SellPrice: number;
    Quantity: number;

    constructor(code: string)
    {
        this.Code = code
    }
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
    Items: Array<SellInfo>;
    Date: Date;
}