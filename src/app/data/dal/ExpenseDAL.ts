import { Core } from './../../core';
import { DataLayer } from './../data.layer';
import { ExpenseInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class ExpenseDAL {
    PATH: string = "/expenses/items";
    PATH_TYPES: string = "/expenses/types";

    constructor(private core: Core, private DL: DataLayer, private af: AngularFireDatabase) {}

    LoadByYearAndMonth(selectedYear: number, selectedMonth: number) {
        this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYMONTH, equalTo: parseInt(selectedYear + this.core.az(selectedMonth)) } }).first().subscribe(snapshots => {
            this.DL.Expenses = new Array<ExpenseInfo>();
            this.DL.ExpenseTotal = 0;

            snapshots.forEach(snapshot => {
                let info: ExpenseInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Expenses.push(info);
                this.DL.ExpenseTotal += info.Amount;
            });

            this.DL.Expenses.sort((item1, item2) => item1.KeyDay - item2.KeyDay);
            this.DL.Expenses.reverse();
        });
    }

    public Save(item: ExpenseInfo) {
        this.af.list(this.PATH).push(item);
    }

    public Delete(item: ExpenseInfo) {
        this.af.list(this.PATH).remove(item.key);
    }
}