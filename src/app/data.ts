import { Injectable, ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { Core } from './core';
import { ProductInfo, MemberInfo, SellInfo, TransactionInfo, QueryInfo } from './models';
import 'rxjs/add/operator/first';

@Injectable()
export class DataLayer {
    Products: Array<ProductInfo>;
    Product: ProductInfo;

    Members: Array<MemberInfo>;
    Member: MemberInfo;
    
    Transactions: Array<TransactionInfo>;
    Transaction: TransactionInfo;

    SellInfos: Array<SellInfo>;
    Query: QueryInfo;
    Date: Date = new Date();
}

@Injectable()
export class DataAccess {
    PRODUCTS: string = "/products";
    MEMBERS: string = "/members";
    SELL_INFOS: string = "/sellInfos";
    TRANSACTIONS: string;

    constructor(private core: Core, private DL: DataLayer, private af: AngularFireDatabase) { 
        this.DL.Query = new QueryInfo();
        this.DL.Query.KeyDay = this.core.dateToKeyDay(this.DL.Date);
        this.DL.Query.KeyMonth = this.core.dateToKeyMonth(this.DL.Date);
        this.DL.Query.KeyYear = this.DL.Date.getFullYear();
        this.TRANSACTIONS = "/transactions/" + this.DL.Query.KeyYear + "/" + this.DL.Query.KeyMonth;
    }

    public LoadData(): void {
        this.LoadMemberData();
        this.LoadActiveData();
    }

    LoadActiveData() {
        this.af.list(this.PRODUCTS, {query: {  orderByChild: 'Description'}}).subscribe(snapshots => {
            this.DL.Products = new Array<ProductInfo>();

            snapshots.forEach(snapshot => {
                let info = new ProductInfo();
                info.Code = snapshot.Code;
                info.BuyPrice = snapshot.BuyPrice;
                info.SellPrice = snapshot.SellPrice;
                info.Quantity = snapshot.Quantity;
                info.QuantityNotify = snapshot.QuantityNotify;
                info.Description = snapshot.Description;
                info.key = snapshot.$key;
                this.DL.Products.push(info);
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

        this.af.list(this.TRANSACTIONS, {query: {  orderByChild: 'KeyDay', equalTo: this.DL.Query.KeyDay}}).subscribe(snapshots => {
            this.DL.Transactions = new Array<TransactionInfo>();

            snapshots.forEach(snapshot => {
                let info = new TransactionInfo();
                info.MemberKey = snapshot.MemberKey;
                info.BuyerName = snapshot.BuyerName;
                info.Items = snapshot.Items;
                info.Count = snapshot.Count;
                info.ActionDate = snapshot.ActionDate;
                info.KeyMonth = snapshot.KeyMonth;
                info.KeyDay = snapshot.KeyDay;
                info.key = snapshot.$key;
                this.DL.Transactions.push(info);
            });

            this.DL.Transactions.reverse();
        });
    }

    LoadMemberData() {
        this.af.list(this.MEMBERS, {query: {  orderByChild: 'Name'}}).first().subscribe(snapshots => {
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
                info.key = snapshot.$key;
                this.DL.Members.push(info);
            });
        });
    }

    public ProductSave(item: ProductInfo) {
        if (item.key)
            this.af.list(this.PRODUCTS).update(item.key, item);
        else {
            this.af.list(this.PRODUCTS).push(item);
        }
    }

    public ProductUpdateFromSellInfo() {
        let items = Array<ProductInfo>();

        // update in memory first to prevent data sync issue
        this.DL.SellInfos.forEach(sell => {
            this.DL.Products.forEach(product => {
                if(sell.Code == product.Code) {
                    product.Quantity -= sell.Quantity;
                    items.push(product);
                }
            });
        });

        // do the actual database udate
        items.forEach(item => {
            this.ProductSave(item);
        });
    }

    public MemberSave(item: MemberInfo) {
        if (item.key)
            this.af.list(this.MEMBERS).update(item.key, item);
        else { 
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
        info.KeyDay = this.core.dateToKeyDay(this.DL.Date);
        info.KeyMonth= this.core.dateToKeyMonth(this.DL.Date);

        this.TransactionInfoSave(info);
        this.ProductUpdateFromSellInfo();
        this.SellInfoClear();
    }

    public TransactionInfoSave(item: TransactionInfo) {
        this.af.list(this.TRANSACTIONS).push(item);
    }
}