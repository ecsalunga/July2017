import { Core } from './../../core';
import { DataLayer } from './../data.layer';
import { ReportInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class ReportDAL {
    PATH: string = "/reports";

    constructor(private core: Core, private DL: DataLayer, private af: AngularFireDatabase) { }

    public Load() {
        this.LoadByYearAndMonth(this.DL.ReportToday.KeyYear, this.DL.ReportToday.KeyMonth);
    }

    LoadByYearAndMonth(selectedYear: number, selectedMonth: number) {
        this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYMONTH, equalTo: parseInt(selectedYear + this.core.az(selectedMonth)) } }).first().subscribe(snapshots => {
            this.DL.Reports = new Array<ReportInfo>();
            this.DL.ReportSelected = new ReportInfo();

            snapshots.forEach(snapshot => {
                // get today report
                if(snapshot.KeyDay == this.DL.ReportToday.KeyDay) {
                    this.DL.ReportToday = snapshot;
                    this.DL.ReportToday.key = snapshot.$key;
                }

                this.DL.Reports.push(snapshot);
                this.DL.ReportSelected.SaleCount += snapshot.SaleCount;
                this.DL.ReportSelected.SaleAmount += snapshot.SaleAmount;
                this.DL.ReportSelected.ExpenseCount += snapshot.ExpenseCount;
                this.DL.ReportSelected.ExpenseAmount += snapshot.ExpenseAmount;
            });

            this.DL.Reports.reverse();
        });
    }

    public SaveTodayReport() {
        if (this.DL.ReportToday.key)
            this.af.list(this.PATH).update(this.DL.ReportToday.key, this.DL.ReportToday);
        else
            this.af.list(this.PATH).push(this.DL.ReportToday);
    } 

    public Save(item: ReportInfo) {
        if (item.key)
            this.af.list(this.PATH).update(item.key, item);
        else
            this.af.list(this.PATH).push(item);
    }
}