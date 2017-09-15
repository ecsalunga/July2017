import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ExpenseInfo, ReportInfo } from '../../data/models';

@Component({
  selector: 'transaction-cancel',
  templateUrl: './transaction-cancel.component.html',
  styleUrls: ['./transaction-cancel.component.css']
})
export class TransactionCancelComponent implements OnInit {
  yearSelected: number;
  monthSelected: number;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    this.yearSelected = this.DL.Date.getFullYear();
    this.monthSelected = this.DL.Date.getMonth()+1;
    this.DL.TransactionCancelSelected = this.DL.TransactionCancels;
  }

  Filter() {
    let keyMonth = parseInt(this.yearSelected + this.core.az(this.monthSelected));
    this.DA.TransactionCancelLoad(keyMonth);
  }

  GetDate(keyDay: number): Date {
    return this.core.numberToDate(keyDay);
  }

  ngOnInit() {
    this.DL.TITLE = "Cancelled Transactions";
  }
}
