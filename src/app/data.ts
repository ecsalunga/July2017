import { Injectable, ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ProductInfo } from './models';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';

@Injectable()
export class DataLayer {
    Products: Array<ProductInfo>;
    Product: ProductInfo;
}

@Injectable()
export class DataAccess {
    constructor(private DL: DataLayer, private af: AngularFireDatabase) { }

    public LoadData(): void {
       this.af.list('/products').subscribe(snapshots => {
            this.DL.Products = new Array<ProductInfo>();

            snapshots.forEach(snapshot => {
                let product = new ProductInfo(snapshot.Code);
                product.BuyPrice = snapshot.BuyPrice;
                product.SellPrice = snapshot.SellPrice;
                product.Quantity = snapshot.Quantity;
                product.Description = snapshot.Description;
                product.key = snapshot.$key;
                this.DL.Products.push(product);
            });
        });
    }

    public SaveProduct(item: ProductInfo) {
        if (item.key)
            this.af.list('/products').update(item.key, item);
        else
            this.af.list('/products').push(item);
    }
}