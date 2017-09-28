import { Core } from './../../core';
import { DataLayer, DataAccess } from './../../data';
import { CancelInfo, ProductInfo, ReportInfo, TransactionInfo, ExpenseInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class CancelDAL {
    PATH: string = "/transactions/cancels";
    PATH_TRANSACTION: string = "/transactions/items";
    constructor(private core: Core, private DL: DataLayer, private DA: DataAccess, private af: AngularFireDatabase) {}

    LoadByYearAndMonth(selectedYear: number, selectedMonth: number) {
        this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYMONTH, equalTo: parseInt(selectedYear + this.core.az(selectedMonth)) }}).first().subscribe(snapshots => {
            this.DL.TransactionCancels = new Array<CancelInfo>();
            snapshots.forEach(snapshot => {
                let info: CancelInfo = snapshot;
                this.DL.TransactionCancels.push(info);
            });

            this.DL.TransactionCancels.reverse();
        });
    }

    public CancelSelected(description: string, tran: TransactionInfo) {
        let items = Array<ProductInfo>();

        // update in memory first to prevent data sync issue
        tran.Items.forEach(sell => {
            this.DL.Products.forEach(product => {
                if (sell.Code == product.Code) {
                    product.Quantity += sell.Quantity;
                    items.push(product);
                }
            });
        }); 

        // do the actual database update
        items.forEach(item => {
            this.DA.ProductSave(item);
        });

        // save cancel info
        let info = new CancelInfo();
        info.UserKey = this.DL.User.key;
        info.UserName = this.DL.User.Name;
        info.Description = description;
        info.Transaction = tran;
        info.ActionDate = this.core.dateToNumber(new Date());
        info.KeyMonth = this.core.dateToKeyMonth(this.DL.Date);
        this.Save(info);

        // delete transaction
        this.transactionInfoDelete(tran.key);
        this.DA.ReportReGenerate(tran.KeyDay);
    }

    private transactionInfoDelete(key: string) {
        this.af.object(this.PATH_TRANSACTION + "/" + key).remove();
    }

    public Save(item: CancelInfo) {
        this.af.list(this.PATH).push(item);
    }
}