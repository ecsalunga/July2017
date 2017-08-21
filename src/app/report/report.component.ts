import { Component, OnInit } from '@angular/core';

import { Core } from '../core';
import { DataAccess, DataLayer } from '../data';
import { ExpenseInfo, ReportInfo } from '../models';

@Component({
  selector: 'report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  yearSelected: number;
  month: number;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) { 
    this.yearSelected = this.DL.Date.getFullYear();
    this.month = this.DL.Date.getMonth()+1;
  }

  ReportView() {
    this.DA.ReportMonthlyLoad(this.yearSelected, this.month)
  }

  ngOnInit() {
  }

}
