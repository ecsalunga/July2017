import { Core } from './../../core';
import { DataLayer, DataAccess } from './../../data';
import { ReportInfo, TransactionInfo, ExpenseInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class ReportDAL {
    PATH: string = "/reports";
    PATH_EXPENSE: string = "/expenses/items";
    PATH_TRANSACTION: string = "/transactions/items";

    constructor(private core: Core, private DL: DataLayer, private DA: DataAccess, private af: AngularFireDatabase) { }

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

    public ReGenerate(year: number, keyMonth: number, keyDay: number) {
        // get report for that day
        let report = new ReportInfo();
        report.KeyYear = year;
        report.KeyMonth = keyMonth;
        report.KeyDay = keyDay;

        let transaction = new TransactionInfo();
        let expense = new ExpenseInfo();

        this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYMONTH, equalTo: report.KeyMonth } }).first().subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                if(snapshot.KeyDay == report.KeyDay) {
                    report.key = snapshot.$key;
                    report.COHStart = snapshot.COHStart;
                    report.COHActual = snapshot.COHActual;
                } 
            });

            // get transactions
            this.af.list(this.PATH_TRANSACTION, { query: { orderByChild: this.DL.KEYDAY, equalTo: report.KeyDay } }).first().subscribe(snapshots => {
                snapshots.forEach(snapshot => {
                    report.SaleCount += snapshot.Count;
                    report.SaleAmount += snapshot.Amount;
                });

                // get expenses
                this.af.list(this.PATH_EXPENSE, { query: { orderByChild: this.DL.KEYDAY, equalTo: keyDay } }).first().subscribe(snapshots => {
                    snapshots.forEach(snapshot => {
                        report.ExpenseCount++;
                        report.ExpenseAmount += snapshot.Amount;
                    });

                    // save
                    if (report.key)
                        this.af.list(this.PATH).update(report.key, report);
                    else
                        this.af.list(this.PATH).push(report);

                    // load affected
                    this.DA.TransactionSelectedLoad(report);
                    this.DA.ExpenseSelectedLoad(report);
                });
            });
        });
    }
}