import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { CancelInfo } from '../../data/models';

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
    this.Filter();
  }

  SelectTransaction(info: CancelInfo) {
    this.DL.TransactionFromList = "transaction-cancel";
    this.DL.Transaction = info.Transaction;
    this.DL.LoadFromLink("transaction-detail");
  }

  Filter() {
    this.DA.TransactionCancelMonthlyLoad(this.yearSelected, this.monthSelected);
  }

  GetDate(keyDay: number): Date {
    return this.core.numberToDate(keyDay);
  }

  ngOnInit() {
    this.DL.TITLE = "Cancelled Transactions";
  }
}
