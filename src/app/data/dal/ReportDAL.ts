import { Core } from './../../core';
import { DataLayer } from './../data.layer';
import { ReportInfo } from './../../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class ReportDAL {
    PATH: string;

    constructor(private core: Core, private DL: DataLayer, private af: AngularFireDatabase) {
        this.PATH = "/reports/" + this.DL.ReportToday.KeyYear;
    }

    public Load() {
        this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYDAY, equalTo: this.DL.ReportToday.KeyDay } }).first().subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                this.DL.ReportToday = snapshot;
                this.DL.ReportToday.key = snapshot.$key;
            });
        });
    }

    LoadByYearAndMonth(selectedYear: number, selectedMonth: number) {
        this.af.list("/reports/" + selectedYear, { query: { orderByChild: this.DL.KEYMONTH, equalTo: parseInt(selectedYear + this.core.az(selectedMonth)) } }).first().subscribe(snapshots => {
            this.DL.Reports = new Array<ReportInfo>();
            this.DL.ReportSelected = new ReportInfo();
            this.DL.ReportSelected.SaleCount = 0;
            this.DL.ReportSelected.SaleAmount = 0;
            this.DL.ReportSelected.ExpenseCount = 0;
            this.DL.ReportSelected.ExpenseAmount = 0;

            snapshots.forEach(snapshot => {
                this.DL.Reports.push(snapshot);
                this.DL.ReportSelected.SaleCount += snapshot.SaleCount;
                this.DL.ReportSelected.SaleAmount += snapshot.SaleAmount;
                this.DL.ReportSelected.ExpenseCount += snapshot.ExpenseCount;
                this.DL.ReportSelected.ExpenseAmount += snapshot.ExpenseAmount;
            });

            this.DL.Reports.reverse();
        });
    }

    public Save() {
        if (this.DL.ReportToday.key)
            this.af.list(this.PATH).update(this.DL.ReportToday.key, this.DL.ReportToday);
        else
            this.af.list(this.PATH).push(this.DL.ReportToday);
    }
}