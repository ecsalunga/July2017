import { Injectable, ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ProductInfo, MemberInfo, SellInfo } from './models';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';

@Injectable()
export class DataLayer {
    Products: Array<ProductInfo>;
    Product: ProductInfo;

    Members: Array<MemberInfo>;
    Member: MemberInfo;

    SellInfos: Array<SellInfo>;
}

@Injectable()
export class DataAccess {
    constructor(private DL: DataLayer, private af: AngularFireDatabase) { }

    public LoadData(): void {
       this.af.list('/products', {query: {  orderByChild: 'Status', equalTo: 1}}).subscribe(snapshots => {
            this.DL.Products = new Array<ProductInfo>();

            snapshots.forEach(snapshot => {
                let product = new ProductInfo();
                product.Code = snapshot.Code;
                product.BuyPrice = snapshot.BuyPrice;
                product.SellPrice = snapshot.SellPrice;
                product.Quantity = snapshot.Quantity;
                product.NotifyQuantity = snapshot.NotifyQuantity;
                product.Description = snapshot.Description;
                product.Status = snapshot.Status;
                product.key = snapshot.$key;
                this.DL.Products.push(product);
            });
        });

        this.af.list('/members', {query: {  orderByChild: 'Status', equalTo: 1}}).subscribe(snapshots => {
            this.DL.Members = new Array<MemberInfo>();

            snapshots.forEach(snapshot => {
                let member = new MemberInfo();
                member.Name = snapshot.Name;
                member.Address1 = snapshot.Address1;
                member.Address2 = snapshot.Address2;
                member.Address3 = snapshot.Address3;
                member.Contact1 = snapshot.Contact1;
                member.Contact2 = snapshot.Contact2;
                member.Contact3 = snapshot.Contact3;
                member.JoinDate = snapshot.JoinDate;
                member.Status = snapshot.Status;
                member.key = snapshot.$key;
                this.DL.Members.push(member);
            });
        });

        this.af.list('/sellInfos').subscribe(snapshots => {
            this.DL.SellInfos = new Array<SellInfo>();
            let itemCount: number = 0;
            let grandTotal: number = 0;

            snapshots.forEach(snapshot => {
                let sellInfo = new SellInfo();
                sellInfo.Code = snapshot.Code;
                sellInfo.Description = snapshot.Description;
                sellInfo.Quantity = snapshot.Quantity;
                sellInfo.Price = snapshot.Price;
                sellInfo.Total = snapshot.Total;
                sellInfo.key = snapshot.$key;
                this.DL.SellInfos.push(sellInfo);

                itemCount+= sellInfo.Quantity;
                grandTotal+= sellInfo.Total;
            });
            
            if(itemCount > 0) {
                let sellInfo = new SellInfo();
                sellInfo.Code = "";
                sellInfo.Description = "TOTAL";
                sellInfo.Quantity = itemCount;
                sellInfo.Total = grandTotal;
                sellInfo.key = "";
                this.DL.SellInfos.push(sellInfo);
            }
        });
    }

    public SaveProduct(item: ProductInfo) {
        if (item.key)
            this.af.list('/products').update(item.key, item);
        else {
            item.Status = 1;
            this.af.list('/products').push(item);
        }
    }

    public SaveMember(item: MemberInfo) {
        if (item.key)
            this.af.list('/members').update(item.key, item);
        else { 
            item.Status = 1;
            this.af.list('/members').push(item);
        }
    }

    public SaveSellInfo(item: SellInfo) {
        this.af.list('/sellInfos').push(item);
    }

    public DeleteSellInfo(item: SellInfo) {
        this.af.list('/sellInfos').remove(item.key);
    }

    public ClearSellInfo() {
        this.af.list('/sellInfos').remove();
    }
}