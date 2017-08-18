import { Injectable, ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { Core } from './core';
import { ProductInfo, MemberInfo, SellInfo, TransactionInfo, QueryInfo, ReportInfo } from './models';
import 'rxjs/add/operator/first';

@Injectable()
export class DataLayer {
    Product: ProductInfo;
    Products: Array<ProductInfo>;

    Member: MemberInfo;
    Members: Array<MemberInfo>;

    Transaction: TransactionInfo;
    Transactions: Array<TransactionInfo>;

    SellInfos: Array<SellInfo>;
    SellInfosAmount: number = 0;
    SellInfosCount: number = 0;

    Date: Date = new Date();
    QueryToday: QueryInfo;
    ReportToday: ReportInfo;
}

@Injectable()
export class DataAccess {
    PRODUCTS: string = "/products";
    MEMBERS: string = "/members";
    SELL_INFOS: string = "/sellInfos";
    TRANSACTIONS: string;
    REPORTS: string;

    constructor(private core: Core, private DL: DataLayer, private af: AngularFireDatabase) { 
        this.DL.QueryToday = new QueryInfo();
        this.DL.ReportToday = new ReportInfo();

        this.DL.QueryToday.KeyDay = this.core.dateToKeyDay(this.DL.Date);
        this.DL.QueryToday.KeyMonth = this.core.dateToKeyMonth(this.DL.Date);
        this.DL.QueryToday.KeyYear = this.DL.Date.getFullYear();

        this.DL.ReportToday.KeyDay = this.DL.QueryToday.KeyDay;
        this.DL.ReportToday.KeyMonth = this.DL.QueryToday.KeyMonth;

        this.TRANSACTIONS = "/transactions/" + this.DL.QueryToday.KeyYear + "/" + this.DL.QueryToday.KeyMonth;
        this.REPORTS = "/reports/" + this.DL.QueryToday.KeyYear;
    }

    public LoadData(): void {
        this.LoadReportToday();
        this.LoadMemberData();
        this.LoadActiveData();
    }

    LoadActiveData() {
        this.af.list(this.PRODUCTS, {query: {  orderByChild: 'Description'}}).subscribe(snapshots => {
            this.DL.Products = new Array<ProductInfo>();

            snapshots.forEach(snapshot => {
                let info = new ProductInfo();
                info = snapshot;
                info.key = snapshot.$key;
                this.DL.Products.push(info);
            });
        });

        this.af.list(this.SELL_INFOS).subscribe(snapshots => {
            this.DL.SellInfos = new Array<SellInfo>();
            this.DL.SellInfosAmount = 0;
            this.DL.SellInfosCount = 0;

            snapshots.forEach(snapshot => {
                let info = new SellInfo();
                info = snapshot;
                info.key = snapshot.$key;
                this.DL.SellInfos.push(info);

                this.DL.SellInfosCount+= info.Quantity;
                this.DL.SellInfosAmount+= info.Total;
            });
        });

        this.af.list(this.TRANSACTIONS, {query: {  orderByChild: 'KeyDay', equalTo: this.DL.QueryToday.KeyDay}}).subscribe(snapshots => {
            this.DL.Transactions = new Array<TransactionInfo>();
            this.DL.QueryToday.Count = 0;
            this.DL.QueryToday.Amount = 0;

            snapshots.forEach(snapshot => {
                this.DL.Transactions.push(snapshot);

                this.DL.QueryToday.Count += snapshot.Count;
                this.DL.QueryToday.Amount += snapshot.Amount;
            });

            // update daily report
            this.DL.ReportToday.Count = this.DL.QueryToday.Count;
            this.DL.ReportToday.Amount = this.DL.QueryToday.Amount;
            this.ReportInfoSave();

            this.DL.Transactions.reverse();
        });

       
    }

    LoadMemberData() {
        this.af.list(this.MEMBERS, {query: {  orderByChild: 'Name'}}).first().subscribe(snapshots => {
            this.DL.Members = new Array<MemberInfo>();

            snapshots.forEach(snapshot => {
                let info = new MemberInfo();
                info = snapshot;
                info.key = snapshot.$key;
                this.DL.Members.push(info);
            });
        });
    }

    LoadReportToday() {
        this.af.list(this.REPORTS, {query: {  orderByChild: 'KeyDay', equalTo: this.DL.QueryToday.KeyDay}}).first().subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                this.DL.ReportToday =  snapshot;
                this.DL.ReportToday.key =  snapshot.$key;
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
        info.Count = this.DL.SellInfosCount;
        info.Amount = this.DL.SellInfosAmount;
        info.ActionDate = this.core.dateToNumber(new Date());
        info.KeyDay = this.core.dateToKeyDay(this.DL.Date);

        this.TransactionInfoSave(info);
        this.ProductUpdateFromSellInfo();
        this.ReportInfoSave();
        this.SellInfoClear();
    }

    public TransactionInfoSave(item: TransactionInfo) {
        this.af.list(this.TRANSACTIONS).push(item);
    }

    public ReportInfoSave() {
        if (this.DL.ReportToday.key)
            this.af.list(this.REPORTS).update(this.DL.ReportToday.key, this.DL.ReportToday);
        else { 
            this.af.list(this.REPORTS).push(this.DL.ReportToday);
            this.LoadReportToday();
        }
    }
}