import { Component, OnInit } from '@angular/core';

import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { TransactionInfo, ReportInfo } from '../../data/models';

@Component({
  selector: 'transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  ReportDate: Date;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    if (this.DL.SOURCE == this.DL.MENU) {
      this.ReportDate = new Date();
      this.TransactionView();
    }
    else
      this.ReportDate = this.core.keyDayToDate(this.DL.ReportSelected.KeyDay);
  }

  SelectTransaction(info: TransactionInfo) {
    this.DL.TransactionFromList = "transaction-list";
    this.DL.Transaction = info;
    this.DL.LoadFromLink("transaction-detail");
  }

  TransactionView() {
    this.DL.ReportSelected = new ReportInfo();
    this.DL.ReportSelected.KeyDay = this.core.dateToKeyDay(this.ReportDate);
    this.DL.ReportSelected.KeyMonth = this.core.dateToKeyMonth(this.ReportDate);
    this.DL.ReportSelected.KeyYear = this.ReportDate.getFullYear();
    this.DA.TransactionLoadByKeyDay(this.DL.ReportSelected.KeyDay);
    this.DL.GotoTop();
  }

  ngOnInit() {
    this.DL.TITLE = "Transaction List";
  }
}
