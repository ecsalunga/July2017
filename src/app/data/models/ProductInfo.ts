export class ProductInfo {
    key: string;
    Code: string;
    Description: string;
    Price: number;
    Quantity: number;
    QuantityNotify: number;
    SupportSnapshot: boolean;

    constructor() {
        this.SupportSnapshot = true;
    }
}