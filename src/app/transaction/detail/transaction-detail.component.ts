import { Component, OnInit } from '@angular/core';

import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';


@Component({
  selector: 'transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css']
})
export class TransactionDetailComponent implements OnInit {

  constructor(private core: Core, private DL: DataLayer) { }
  
  LoadList() {
    this.DL.LoadFromLink("transaction-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Transaction Details";
  }
}
