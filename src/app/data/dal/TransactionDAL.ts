import { Core } from './../../core';
import { DataLayer, DataAccess } from './../../data';
import { SellInfo, TransactionInfo, ReportInfo } from './../../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class TransactionDAL {
    PATH: string = "/transactions/items";
    PATH_SELL: string = "/transactions/sellInfos";
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

                this.DL.ReportSelected.SaleCount += snapshot.SaleCount;
                this.DL.ReportSelected.SaleAmount += snapshot.SaleAmount;
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

    public Save(item: TransactionInfo) {
        this.af.list(this.PATH).push(item);
    }

    public SellSave(item: SellInfo) {
        this.af.list(this.PATH_SELL).push(item);
    }

    public SellDone(memberKey: string, buyerName: string) {
        let info = new TransactionInfo();
        info.MemberKey = memberKey
        info.BuyerName = buyerName;
        info.Items = this.DL.SellInfos;
        info.Count = this.DL.SellInfosCount;
        info.Amount = this.DL.SellInfosAmount;
        info.ActionDate = this.core.dateToNumber(new Date());
        info.KeyDay = this.core.dateToKeyDay(this.DL.Date);

        this.Save(info);
        this.DA.ProductUpdteFromSellInfo();
        this.DA.ReportTodaySave();
        this.DA.SellInfoClear();
    }

    public SellDelete(item: SellInfo) {
        this.af.list(this.PATH_SELL).remove(item.key);
    }

    public SellClear() {
        this.af.list(this.PATH_SELL).remove();
    }
}