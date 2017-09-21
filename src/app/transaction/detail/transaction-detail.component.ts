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

  constructor(private core: Core, public DL: DataLayer, private DA: DataAccess) { }
  
  Cancel() {
    this.DA.TransactionSelectedCancel(this.description);
    this.DL.LoadFromMenu("transaction-list");
    this.DL.Display("Transaction Details", "Cancelled!");
  }

  LoadList() {
    this.DL.LoadFromLink("transaction-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Transaction Details";
  }
}
