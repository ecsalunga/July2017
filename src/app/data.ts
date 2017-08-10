import { Injectable, ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ProductInfo, MemberInfo } from './models';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';

@Injectable()
export class DataLayer {
    Products: Array<ProductInfo>;
    Product: ProductInfo;

    Members: Array<MemberInfo>;
    Member: MemberInfo;
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
                member.Address = snapshot.Address;
                member.Block = snapshot.Block;
                member.Lot = snapshot.Lot;
                member.Contact1 = snapshot.Contact1;
                member.Contact2 = snapshot.Contact2;
                member.Contact3 = snapshot.Contact3;
                member.JoinDate = snapshot.JoinDate;
                member.Status = snapshot.Status;
                member.key = snapshot.$key;
                this.DL.Members.push(member);
            });
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
}