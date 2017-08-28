import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';

@Component({
  selector: 'transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css']
})
export class TransactionDetailComponent implements OnInit {
  description: string;

  constructor(private core: Core, private DL: DataLayer, private DA: DataAccess) { }
  
  Cancel() {
    this.DA.TransactionCancel(this.description, this.DL.Transaction);
    this.LoadList();
  }

  LoadList() {
    this.DL.LoadFromLink("transaction-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Transaction Details";
  }
}
