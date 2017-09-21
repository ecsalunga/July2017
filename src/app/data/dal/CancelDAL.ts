import { Core } from './../../core';
import { DataLayer, DataAccess } from './../../data';
import { CancelInfo, ProductInfo, ReportInfo, TransactionInfo, ExpenseInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class CancelDAL {
    PATH: string = "/transactions/cancels";
    PATH_TRANSACTION: string = "/transactions/items";
    constructor(private core: Core, private DL: DataLayer, private DA: DataAccess, private af: AngularFireDatabase) {}

    public Load() {
        this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYMONTH, equalTo: this.DL.KeyMonth }}).first().subscribe(snapshots => {
            this.DL.TransactionCancels = new Array<CancelInfo>();
            snapshots.forEach(snapshot => {
                let info: CancelInfo = snapshot;
                this.DL.TransactionCancels.push(info);
            });

            this.DL.TransactionCancels.reverse();
        });
    }

    public LoadByKeyMonth(keyMonth: number) {
        if(this.DL.KeyMonth == keyMonth) {
            this.Load();
            this.DL.TransactionCancelSelected = this.DL.TransactionCancels;
        }
        else {
            this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYMONTH, equalTo: keyMonth }}).first().subscribe(snapshots => {
                this.DL.TransactionCancelSelected = new Array<CancelInfo>();
                snapshots.forEach(snapshot => {
                    let info: CancelInfo = snapshot;
                    this.DL.TransactionCancelSelected.push(info);
                });

                this.DL.TransactionCancelSelected.reverse();
            });
        }
    }

    public CancelSelected(description: string) {
        let items = Array<ProductInfo>();

        // update in memory first to prevent data sync issue
        this.DL.Transaction.Items.forEach(sell => {
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
        info.Description = description;
        info.Amount = this.DL.Transaction.Amount;
        info.ActionDate = this.core.dateToNumber(new Date());
        info.KeyMonth = this.core.dateToKeyMonth(this.DL.Date);
        this.Save(info);

        // delete transaction
        this.transactionInfoDelete(this.DL.ReportSelected, this.DL.Transaction.key);

        // report recompute
        this.DA.ReportReGenerateBySelected();
    }

    private transactionInfoDelete(report: ReportInfo, key: string) {
        this.af.object(this.PATH_TRANSACTION + "/" + key).remove();
    }

    public Save(item: CancelInfo) {
        this.af.list(this.PATH).push(item);
        this.LoadByKeyMonth(item.KeyMonth);
    }
}