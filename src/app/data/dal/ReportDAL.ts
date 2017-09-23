import { Core } from './../../core';
import { DataLayer, DataAccess } from './../../data';
import { ReportInfo, TransactionInfo, ExpenseInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class ReportDAL {
    PATH: string = "/reports";
    PATH_EXPENSE: string = "/expenses/items";
    PATH_TRANSACTION: string = "/transactions/items";

    constructor(private core: Core, private DL: DataLayer, private DA: DataAccess, private af: AngularFireDatabase) { }

    LoadByYearAndMonth(selectedYear: number, selectedMonth: number) {
        this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYMONTH, equalTo: parseInt(selectedYear + this.core.az(selectedMonth)) } }).first().subscribe(snapshots => {
            this.DL.Reports = new Array<ReportInfo>();
            this.DL.ReportSelected = new ReportInfo();

            snapshots.forEach(snapshot => {
                let info: ReportInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Reports.push(info);

                this.DL.ReportSelected.SaleCount += info.SaleCount;
                this.DL.ReportSelected.SaleAmount += info.SaleAmount;
                this.DL.ReportSelected.ExpenseCount += info.ExpenseCount;
                this.DL.ReportSelected.ExpenseAmount += info.ExpenseAmount;
            });

            this.DL.Reports.sort((item1, item2) => item1.KeyDay - item2.KeyDay);
            this.DL.Reports.reverse();
        });
    }

    public Save(item: ReportInfo) {
        if (item.key)
            this.af.list(this.PATH).update(item.key, item);
        else
            this.af.list(this.PATH).push(item);
    }

    public ReGenerate(year: number, keyMonth: number, keyDay: number) {
        let report = new ReportInfo();
        report.KeyYear = year;
        report.KeyMonth = keyMonth;
        report.KeyDay = keyDay;

        this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYMONTH, equalTo: report.KeyMonth } }).first().subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                if(snapshot.KeyDay == report.KeyDay) {
                    report.COHStart = snapshot.COHStart;
                    report.COHActual = snapshot.COHActual;
                    this.af.list(this.PATH).remove(snapshot.$key);
                }
            });

            // get transactions
            this.CreateReport(report);
        });
    }

    public Generate(year: number, keyMonth: number, keyDay: number, startCOH: number, actualCOH: number) { 
        let report = new ReportInfo();
        report.KeyYear = year;
        report.KeyMonth = keyMonth;
        report.KeyDay = keyDay;
        report.COHStart = startCOH;
        report.COHActual = actualCOH;

        // remove existing
        this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYMONTH, equalTo: report.KeyMonth } }).first().subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                if(snapshot.KeyDay == report.KeyDay) {
                    this.af.list(this.PATH).remove(snapshot.$key);
                }
            });
        });

        this.CreateReport(report);
    }

    private CreateReport(report: ReportInfo) {
        // get transactions
        this.af.list(this.PATH_TRANSACTION, { query: { orderByChild: this.DL.KEYDAY, equalTo: report.KeyDay } }).first().subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                report.SaleCount += snapshot.Count;
                report.SaleAmount += snapshot.Amount;
            });

            // get expenses
            this.af.list(this.PATH_EXPENSE, { query: { orderByChild: this.DL.KEYDAY, equalTo: report.KeyDay } }).first().subscribe(snapshots => {
                snapshots.forEach(snapshot => {
                    report.ExpenseCount++;
                    report.ExpenseAmount += snapshot.Amount;
                });

                // save
                if(report.SaleAmount != 0 || report.ExpenseAmount != 0)
                    this.af.list(this.PATH).push(report);
                
                this.DA.DataLoaded.emit(this.DL.DATA_REPORT);
            });
        });
    }
}