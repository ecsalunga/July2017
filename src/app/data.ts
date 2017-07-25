import { Injectable, ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Core } from './core';
import { ProductInfo } from './models';

@Injectable()
export class Data {
    Products: Array<ProductInfo>;
    SelectedProduct: ProductInfo;

    constructor(public core: Core) {
        this.LoadProducts();
    }

    public LoadProducts(): void {
        this.Products = new Array<ProductInfo>();
        for(let x=0; x < 10; x++)
        {
            let product = new ProductInfo("P00" + x);
            product.BuyPrice = x;
            product.SellPrice = x;
            product.Quantity = x + 12;
            product.Description = 'Sample Product ' + x;
            this.Products.push(product);
        }
    }
}