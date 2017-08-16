import { Injectable, ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { Core } from './core';
import { ProductInfo, MemberInfo, SellInfo, TransactionInfo } from './models';

@Injectable()
export class DataLayer {
    Products: Array<ProductInfo>;
    Product: ProductInfo;

    Members: Array<MemberInfo>;
    Member: MemberInfo;
    
    Transactions: Array<TransactionInfo>;
    Transaction: TransactionInfo;

    SellInfos: Array<SellInfo>;
}

@Injectable()
export class DataAccess {
    PRODUCTS: string = "/products";
    MEMBERS: string = "/members";
    SELL_INFOS: string = "/sellInfos";
    TRANSACTION_INFOS: string = "/transactionInfos";

    constructor(private core: Core, private DL: DataLayer, private af: AngularFireDatabase) { }

    public LoadData(): void {
       this.af.list(this.PRODUCTS, {query: {  orderByChild: 'Status', equalTo: 1}}).subscribe(snapshots => {
            this.DL.Products = new Array<ProductInfo>();

            snapshots.forEach(snapshot => {
                let info = new ProductInfo();
                info.Code = snapshot.Code;
                info.BuyPrice = snapshot.BuyPrice;
                info.SellPrice = snapshot.SellPrice;
                info.Quantity = snapshot.Quantity;
                info.QuantityNotify = snapshot.QuantityNotify;
                info.Description = snapshot.Description;
                info.Status = snapshot.Status;
                info.key = snapshot.$key;
                this.DL.Products.push(info);
            });
        });

        this.af.list(this.MEMBERS, {query: {  orderByChild: 'Status', equalTo: 1}}).subscribe(snapshots => {
            this.DL.Members = new Array<MemberInfo>();

            snapshots.forEach(snapshot => {
                let info = new MemberInfo();
                info.Name = snapshot.Name;
                info.Address1 = snapshot.Address1;
                info.Address2 = snapshot.Address2;
                info.Address3 = snapshot.Address3;
                info.Contact1 = snapshot.Contact1;
                info.Contact2 = snapshot.Contact2;
                info.Contact3 = snapshot.Contact3;
                info.JoinDate = snapshot.JoinDate;
                info.Status = snapshot.Status;
                info.key = snapshot.$key;
                this.DL.Members.push(info);
            });
        });

        this.af.list(this.SELL_INFOS).subscribe(snapshots => {
            this.DL.SellInfos = new Array<SellInfo>();
            let itemCount: number = 0;
            let grandTotal: number = 0;

            snapshots.forEach(snapshot => {
                let info = new SellInfo();
                info.Code = snapshot.Code;
                info.Description = snapshot.Description;
                info.Quantity = snapshot.Quantity;
                info.Price = snapshot.Price;
                info.Total = snapshot.Total;
                info.key = snapshot.$key;
                this.DL.SellInfos.push(info);

                itemCount+= info.Quantity;
                grandTotal+= info.Total;
            });
            
            if(itemCount > 0) {
                let info = new SellInfo();
                info.Code = "TOTAL";
                info.Description = "TOTAL";
                info.Quantity = itemCount;
                info.Total = grandTotal;
                info.key = "";
                this.DL.SellInfos.push(info);
            }
        });

        this.af.list(this.TRANSACTION_INFOS, {query: {  orderByChild: 'ActionDate'}}).subscribe(snapshots => {
            this.DL.Transactions = new Array<TransactionInfo>();

            snapshots.forEach(snapshot => {
                let info = new TransactionInfo();
                info.MemberKey = snapshot.MemberKey;
                info.BuyerName = snapshot.BuyerName;
                info.Items = snapshot.Items;
                info.Count = snapshot.Count;
                info.ActionDate = snapshot.ActionDate;
                info.key = snapshot.$key;
                this.DL.Transactions.push(info);
            });

            this.DL.Transactions.reverse();
        });
    }

    public ProductSave(item: ProductInfo) {
        if (item.key)
            this.af.list(this.PRODUCTS).update(item.key, item);
        else {
            item.Status = 1;
            this.af.list(this.PRODUCTS).push(item);
        }
    }

    public MemberSave(item: MemberInfo) {
        if (item.key)
            this.af.list(this.MEMBERS).update(item.key, item);
        else { 
            item.Status = 1;
            this.af.list(this.MEMBERS).push(item);
        }
    }

    public SellInfoSave(item: SellInfo) {
        this.af.list(this.SELL_INFOS).push(item);
    }

    public SellInfoDelete(item: SellInfo) {
        this.af.list(this.SELL_INFOS).remove(item.key);
    }

    public SellInfoClear() {
        this.af.list(this.SELL_INFOS).remove();
    }

    public SellInfoDone(menberKey: string, buyerName: string) {
        let info = new TransactionInfo();
        info.MemberKey = menberKey
        info.BuyerName = buyerName;
        info.Items = this.DL.SellInfos;
        info.Count = this.DL.SellInfos.length -1;
        info.ActionDate = this.core.dateToNumber(new Date());
        this.TransactionInfoSave(info);
        this.SellInfoClear();
    }

    public TransactionInfoSave(item: TransactionInfo) {
        this.af.list(this.TRANSACTION_INFOS).push(item);
    }
}