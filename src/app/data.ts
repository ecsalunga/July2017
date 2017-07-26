import { Injectable, ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ProductInfo } from './models';

@Injectable()
export class DataLayer {
    Products: Array<ProductInfo>;
    SelectedProduct: ProductInfo;

    constructor() { }
}

@Injectable()
export class DataAccess {
    constructor(private DL: DataLayer) { }

    public LoadProducts(): void {
        this.DL.Products = new Array<ProductInfo>();
        for (let x = 0; x < 10; x++) {
            let product = new ProductInfo("P00" + x);
            product.BuyPrice = x;
            product.SellPrice = x;
            product.Quantity = x + 12;
            product.Description = 'Sample Product ' + x;
            this.DL.Products.push(product);
        }
    }

    public SaveProduct(item: ProductInfo) {
        if (this.DL.SelectedProduct) {
            this.DL.SelectedProduct.Code = item.Code;
            this.DL.SelectedProduct.Description = item.Description;
            this.DL.SelectedProduct.BuyPrice = item.BuyPrice;
            this.DL.SelectedProduct.SellPrice = item.SellPrice;
            this.DL.SelectedProduct.Quantity = item.Quantity;
        }
        else
            this.DL.Products.push(item);
    }
}