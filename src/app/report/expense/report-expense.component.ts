import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ExpenseInfo, ReportInfo } from '../../models';

@Component({
  selector: 'report-expense',
  templateUrl: './report-expense.component.html',
  styleUrls: ['./report-expense.component.css']
})
export class ReportExpenseComponent implements OnInit {
  ctrl: FormControl;
  filteredExpenses: any;

  description: string;
  amount: number;
  ReportDate: Date;
  isToday: boolean;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) { 
    this.DL.ExpenseSelected = this.DL.ExpensesToday;
    this.DL.ReportSelected = this.DL.ReportToday;
    this.ReportDate = this.core.numberToDate(parseInt(this.DL.ReportSelected.KeyDay + '000000'));
    this.isToday = true;

    this.ctrl = new FormControl();
    this.filteredExpenses = this.ctrl.valueChanges
        .startWith(null)
        .map(name => this.filterExpenses(name));
  }

  filterExpenses(val: string) {
    return val ? this.DL.ExpenseTypes.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0) : this.DL.ExpenseTypes;
  }

  AddExpense() {
    this.DA.ExpenseInfoSave(this.description, this.amount);
    this.amount = null;
    this.description = "";
    this.ExpenseView();
  }

  private setIsToday() {
    this.isToday = (this.core.dateToKeyDay(new Date()) == this.core.dateToKeyDay(this.ReportDate));
  }

  ExpenseView() {
    this.DL.ReportSelected = new ReportInfo();
    this.DL.ReportSelected.KeyDay = this.core.dateToKeyDay(this.ReportDate);
    this.DL.ReportSelected.KeyMonth = this.core.dateToKeyMonth(this.ReportDate);
    this.DL.ReportSelected.KeyYear = this.ReportDate.getFullYear();
    this.DA.ExpenseSelectedLoad(this.DL.ReportSelected);
    this.setIsToday();
  }

  ngOnInit() {
    this.DL.TITLE = "Expenses";
  }
}
