import { Core } from './../../core';
import { DataLayer, DataAccess } from './../../data';
import { SellInfo, TransactionInfo, ReportInfo, DeliveryInfo, NameValue } from './../../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class TransactionDAL {
    PATH: string = "/transactions/items";
    PATH_SELL: string = "/transactions/sellInfos";
    PATH_DELIVERY: string = "/transactions/deliveryInfos";
    constructor(private core: Core, private DL: DataLayer, private DA: DataAccess, private af: AngularFireDatabase) {}

    public Load() {
        this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYDAY, equalTo: this.DL.ReportToday.KeyDay } }).subscribe(snapshots => {
            this.DL.TransactionsToday = new Array<TransactionInfo>();
            this.DL.ReportToday.SaleCount = 0;
            this.DL.ReportToday.SaleAmount = 0;

            snapshots.forEach(snapshot => {
                let info: TransactionInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.TransactionsToday.push(info);

                this.DL.ReportToday.SaleCount += snapshot.Count;
                this.DL.ReportToday.SaleAmount += snapshot.Amount;
            });
            this.DL.TransactionsToday.reverse();
        });
    }

    LoadByReportInfo(report: ReportInfo) {
        this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYDAY, equalTo: report.KeyDay } }).first().subscribe(snapshots => {
            this.DL.TransactionSelected = new Array<TransactionInfo>();
            this.DL.ReportSelected.SaleCount = 0;
            this.DL.ReportSelected.SaleAmount = 0;

            snapshots.forEach(snapshot => {
                let info: TransactionInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.TransactionSelected.push(info);

                this.DL.ReportSelected.SaleCount += snapshot.Count;
                this.DL.ReportSelected.SaleAmount += snapshot.Amount;
            });

            this.DL.TransactionSelected.reverse();
        });
    }

    public LoadSell() {
        this.af.list(this.PATH_SELL).subscribe(snapshots => {
            this.DL.SellInfos = new Array<SellInfo>();
            this.DL.SellInfosAmount = 0;
            this.DL.SellInfosCount = 0;

            snapshots.forEach(snapshot => {
                let info: SellInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.SellInfos.push(info);

                this.DL.SellInfosCount += info.Quantity;
                this.DL.SellInfosAmount += info.Total;
            });
        });
    }

    public LoadDelivery() {
        this.af.list(this.PATH_DELIVERY).subscribe(snapshots => {
            this.DL.DeliveryInfos = new Array<DeliveryInfo>();

            snapshots.forEach(snapshot => {
                let info: DeliveryInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.DeliveryInfos.push(info);
            });
        });
    }

    public Save(item: TransactionInfo) {
        this.af.list(this.PATH).push(item);
    }

    public SellSave(item: SellInfo) {
        this.af.list(this.PATH_SELL).push(item);
    }


    public SellDone(memberKey: string, buyerName: string, isDelivery: boolean) {
        let info = new TransactionInfo();
        info.MemberKey = memberKey
        info.BuyerName = buyerName;
        info.Items = this.DL.SellInfos;
        info.Count = this.DL.SellInfosCount;
        info.Amount = this.DL.SellInfosAmount;
        info.ActionDate = this.DL.GetActionDate();
        info.KeyDay = this.DL.GetKeyDay();

        if(isDelivery)
            this.DeliveryStart(info);
        else {
            this.Save(info);
            this.DA.ProductUpdteFromSellInfo();
            this.DA.ReportTodaySave();
        }

        this.DA.SellInfoClear();
    }

    public DeliveryStart(info: TransactionInfo) {
        let item = new DeliveryInfo();
        item.UserKey = this.DL.UserPending.key;
        item.UserName = this.DL.UserPending.Name;
        item.Transaction = info;
        item.ActionStart = this.DL.GetActionDate();
        
        this.DL.DeliveryGetInfo(item);
        this.DL.DeliveryUpdateStatus(item, this.DL.STATUS_CREATED);
        this.DeliverySave(item);
    }

    public DeliverySave(item: DeliveryInfo) {
        if (item.key)
            this.af.list(this.PATH_DELIVERY).update(item.key, item);
        else
            this.af.list(this.PATH_DELIVERY).push(item);
    }

    public SellDelete(item: SellInfo) {
        this.af.list(this.PATH_SELL).remove(item.key);
    }

    public SellClear() {
        this.af.list(this.PATH_SELL).remove();
    }
}