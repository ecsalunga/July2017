import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ExpenseInfo, ReportInfo } from '../../data/models';

@Component({
  selector: 'report-expense',
  templateUrl: './report-expense.component.html',
  styleUrls: ['./report-expense.component.css']
})
export class ReportExpenseComponent implements OnInit {
  yearSelected: number;
  monthSelected: number;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) { 
    this.yearSelected = this.DL.Date.getFullYear();
    this.monthSelected = this.DL.Date.getMonth()+1;
    this.View();
  }

  SelectItem(item: ExpenseInfo) {
    this.DL.Expense = item;
    this.DL.LoadFromLink("report-expense-detail");
  }

  AddItem() {
    this.DL.Expense= null;
    this.DL.LoadFromLink("report-expense-detail");
  }

  GetDate(keyDay: number): Date {
    return this.core.keyDayToDate(keyDay);
  }

  View() {
    this.DA.ExpenseMonthlyLoad(this.yearSelected, this.monthSelected)
  }

  ngOnInit() {
    this.DL.TITLE = "Expense List";
  }
}
