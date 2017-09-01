import { Core } from './../../core';
import { DataLayer } from './../data.layer';
import { ExpenseInfo, ReportInfo } from './../../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class ExpenseDAL {
    PATH: string = "/members";
    PATH_TYPES: string = "/expenses/types";

    constructor(private core: Core, private DL: DataLayer, private af: AngularFireDatabase) {
        this.PATH = "/expenses/" + this.DL.ReportToday.KeyYear + "/" + this.DL.ReportToday.KeyMonth;
    }

    public Load() {
        this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYDAY, equalTo: this.DL.ReportToday.KeyDay } }).subscribe(snapshots => {
            this.DL.ExpensesToday = new Array<ExpenseInfo>();
            this.DL.ReportToday.ExpenseAmount = 0;
            this.DL.ReportToday.ExpenseCount = 0;

            snapshots.forEach(snapshot => {
                this.DL.ExpensesToday.push(snapshot);

                this.DL.ReportToday.ExpenseCount++;
                this.DL.ReportToday.ExpenseAmount += snapshot.Amount;
            });
            this.DL.ExpensesToday.reverse();
        });
    }

    public LoadTypes() {
        this.af.object(this.PATH_TYPES).first().subscribe(snapshot => {
            if (snapshot.length)
                this.DL.ExpenseTypes = snapshot;
            else
                this.DL.ExpenseTypes = new Array<string>();
        });
    }

    public LoadByReport(report: ReportInfo) {
        this.af.list("/expenses/" + report.KeyYear + "/" + report.KeyMonth, { query: { orderByChild: this.DL.KEYDAY, equalTo: report.KeyDay } }).first().subscribe(snapshots => {
            this.DL.ExpenseSelected = new Array<ExpenseInfo>();
            this.DL.ReportSelected.ExpenseAmount = 0;
            this.DL.ReportSelected.ExpenseCount = 0;

            snapshots.forEach(snapshot => {
                this.DL.ExpenseSelected.push(snapshot);
                this.DL.ReportSelected.ExpenseCount++;
                this.DL.ReportSelected.ExpenseAmount += snapshot.Amount;
            });

            this.DL.ExpenseSelected.reverse();
        });
    }

    public Save(description: string, amount: number) {
        let info = new ExpenseInfo();
        info.Description = description;
        info.Amount = amount;
        info.ActionDate = this.core.dateToNumber(new Date());
        info.KeyDay = this.core.dateToKeyDay(this.DL.Date);
        this.af.list(this.PATH).push(info);
        
        // add record for auto complete
        if (this.DL.ExpenseTypes.indexOf(description) === -1) {
            this.DL.ExpenseTypes.push(description);
            this.DL.ExpenseTypes.sort();
            this.af.object(this.PATH_TYPES).update(this.DL.ExpenseTypes);
            this.LoadTypes();
        }
    }
}