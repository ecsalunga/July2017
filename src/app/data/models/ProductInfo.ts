export class ProductInfo {
    key: string;
    Code: string;
    Description: string;
    Price: number;
    Quantity: number;
    QuantityNotify: number;
    SupportSnapshot: boolean;
    SupportBorrow: boolean;

    constructor() {
        this.SupportBorrow = false;
        this.SupportSnapshot = true;
    }
}