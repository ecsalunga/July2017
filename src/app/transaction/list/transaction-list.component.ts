import { Component, OnInit } from '@angular/core';

import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { TransactionInfo } from '../../models';

@Component({
  selector: 'transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) { }

  SelectTransaction(info: TransactionInfo) {
    this.DL.Transaction = info;
    this.core.loadComponent("transaction-detail");
  }
  
  ngOnInit() {
  }

}
