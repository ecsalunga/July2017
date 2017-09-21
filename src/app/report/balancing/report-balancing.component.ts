import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ReportInfo } from '../../data/models';

@Component({
  selector: 'report-balancing',
  templateUrl: './report-balancing.component.html',
  styleUrls: ['./report-balancing.component.css']
})
export class ReportBalancingComponent implements OnInit {
  yearSelected: number;
  monthSelected: number;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) { 
    this.yearSelected = this.DL.Date.getFullYear();
    this.monthSelected = this.DL.Date.getMonth()+1;
    this.ReportView();
  }

  ReportView() {
    this.DA.ReportMonthlyLoad(this.yearSelected, this.monthSelected)
  }

  GetComputed(item: ReportInfo) : number {
    if(!item.COHStart)
      item.COHStart = 0;

    return ((item.COHStart + item.SaleAmount) - item.ExpenseAmount)
  }

  GetActual(item: ReportInfo) : number {
    if(!item.COHActual)
      item.COHActual = 0;
    return item.COHActual;
  }

  GetDate(keyDay: number): Date {
    return this.core.keyDayToDate(keyDay);
  }

  ngOnInit() {
    this.DL.TITLE = "Cash Balancing Report";
  }
}
