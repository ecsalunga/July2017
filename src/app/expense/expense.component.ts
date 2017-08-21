import { Component, OnInit } from '@angular/core';

import { Core } from '../core';
import { DataAccess, DataLayer } from '../data';
import { ExpenseInfo, ReportInfo } from '../models';

@Component({
  selector: 'expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  description: string;
  amount: number;
  ReportDate: Date;
  isToday: boolean;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) { 
    this.DL.ExpenseSelected = this.DL.ExpensesToday;
    this.DL.ReportSelected = this.DL.ReportToday;
    this.ReportDate = this.core.numberToDate(parseInt(this.DL.ReportSelected.KeyDay + '000000'));
    this.isToday = true;
  }

  AddExpense() {
    this.DA.ExpenseInfoSave(this.description, this.amount);
    this.amount = 0;
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
  }

}
