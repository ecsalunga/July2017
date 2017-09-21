import { Core } from './../../core';
import { DataLayer } from './../data.layer';
import { ExpenseInfo, ReportInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class ExpenseDAL {
    PATH: string = "/expenses/items";
    PATH_TYPES: string = "/expenses/types";

    constructor(private core: Core, private DL: DataLayer, private af: AngularFireDatabase) {}

    public LoadTypes() {
        this.af.object(this.PATH_TYPES).first().subscribe(snapshot => {
            if (snapshot.$exists())
                this.DL.ExpenseTypes = snapshot;
            else
                this.DL.ExpenseTypes = new Array<string>();
        });
    }

    public LoadByReport(report: ReportInfo) {
        this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYDAY, equalTo: report.KeyDay } }).first().subscribe(snapshots => {
            this.DL.ExpenseSelected = new Array<ExpenseInfo>();
            this.DL.ReportSelected.ExpenseAmount = 0;
            this.DL.ReportSelected.ExpenseCount = 0;

            snapshots.forEach(snapshot => {
                let info: ExpenseInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.ExpenseSelected.push(info);
                this.DL.ReportSelected.ExpenseCount++;
                this.DL.ReportSelected.ExpenseAmount += snapshot.Amount;
            });

            this.DL.ExpenseSelected.reverse();
        });
    }

    public Save(item: ExpenseInfo) {
        this.af.list(this.PATH).push(item);
        
        // add record for auto complete
        if (this.DL.ExpenseTypes.indexOf(item.Description) === -1) {
            this.DL.ExpenseTypes.push(item.Description);
            this.DL.ExpenseTypes.sort();
            this.af.object(this.PATH_TYPES).set(this.DL.ExpenseTypes);
            this.LoadTypes();
        }
    }

    public Delete(item: ExpenseInfo) {
        this.af.list(this.PATH).remove(item.key);
    }

    public TypeDelete() {
        this.af.object(this.PATH_TYPES).remove();
        this.LoadTypes();
    }
}