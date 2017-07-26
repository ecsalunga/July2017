import { Injectable, ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ProductInfo } from './models';

@Injectable()
export class DataLayer {
    Products: Array<ProductInfo>;
    Product: ProductInfo;
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
        // save here
        if (this.DL.Product) {
            this.DL.Product.Code = item.Code;
            this.DL.Product.Description = item.Description;
            this.DL.Product.BuyPrice = item.BuyPrice;
            this.DL.Product.SellPrice = item.SellPrice;
            this.DL.Product.Quantity = item.Quantity;
        }
        else
            this.DL.Products.push(item);
    }
}