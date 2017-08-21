import { Component, OnInit } from '@angular/core';

import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { TransactionInfo, ReportInfo } from '../../models';

@Component({
  selector: 'transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  ReportDate: Date;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {
    this.ReportDate = this.core.numberToDate(parseInt(this.DL.ReportSelected.KeyDay + '000000'));
  }

  SelectTransaction(info: TransactionInfo) {
    this.DL.Transaction = info;
    this.core.loadComponent("transaction-detail");
  }

  TransactionView() {
    this.DL.ReportSelected = new ReportInfo();
    this.DL.ReportSelected.KeyDay = this.core.dateToKeyDay(this.ReportDate);
    this.DL.ReportSelected.KeyMonth = this.core.dateToKeyMonth(this.ReportDate);
    this.DL.ReportSelected.KeyYear = this.ReportDate.getFullYear();
    this.DA.TransactionSelectedLoad(this.DL.ReportSelected);
  }
  
  ngOnInit() {
  }

}
