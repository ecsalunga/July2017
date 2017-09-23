import { Core } from './../../core';
import { DataLayer, DataAccess } from './../';
import { ExpenseInfo, NameValue } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class ExpenseDAL {
    PATH: string = "/expenses/items";
    PATH_TYPES: string = "/expenses/types";

    constructor(private core: Core, private DL: DataLayer, private DA: DataAccess, private af: AngularFireDatabase) {}

    LoadByYearAndMonth(selectedYear: number, selectedMonth: number) {
        this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYMONTH, equalTo: parseInt(selectedYear + this.core.az(selectedMonth)) }}).first().subscribe(snapshots => {
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

    LoadTypes() {
        this.af.list(this.PATH_TYPES).first().subscribe(snapshots => {
            this.DL.ExpenseTypes = new Array<NameValue>();

            snapshots.forEach(snapshot => {
                let info: NameValue = snapshot;
                info.Value = snapshot.$key;
                this.DL.ExpenseTypes.push(info);
            });

            this.DL.ExpenseTypes.sort((item1, item2) => item1.Name.localeCompare(item2.Name));
        });
    }

    public TypeSave(name: string) {
        let item = new NameValue(name, null);
        this.af.list(this.PATH_TYPES).push(item);
    }

    public TypeDelete(item: NameValue) {
        this.af.list(this.PATH_TYPES).remove(item.Value);
    }

    public Save(item: ExpenseInfo) {
        this.af.list(this.PATH).push(item);
        this.ProcessReGenerate(item);
    }

    public Delete(item: ExpenseInfo) {
        this.af.list(this.PATH).remove(item.key);
        this.ProcessReGenerate(item);
    }

    private ProcessReGenerate(item: ExpenseInfo) {
        this.DA.ReportReGenerate(item.KeyDay);
    }
}