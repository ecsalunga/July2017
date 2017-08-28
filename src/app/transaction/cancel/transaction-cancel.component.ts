import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ExpenseInfo, ReportInfo } from '../../models';

@Component({
  selector: 'transaction-cancel',
  templateUrl: './transaction-cancel.component.html',
  styleUrls: ['./transaction-cancel.component.css']
})
export class TransactionCancelComponent implements OnInit {
  yearSelected: number;
  monthSelected: number;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {
    this.yearSelected = this.DL.Date.getFullYear();
    this.monthSelected = this.DL.Date.getMonth()+1;
    this.Filter();
  }

  Filter() {
    this.DA.CancelMonthlyLoad(this.yearSelected, this.monthSelected)
  }

  getDate(keyDay: number): Date {
    return this.core.numberToDate(keyDay);
  }

  ngOnInit() {
    this.DL.TITLE = "Cancelled Transactions";
  }
}
