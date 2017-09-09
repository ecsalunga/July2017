import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ReportInfo } from '../../data/models';

@Component({
  selector: 'report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {
  yearSelected: number;
  monthSelected: number;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) { 
    this.yearSelected = this.DL.Date.getFullYear();
    this.monthSelected = this.DL.Date.getMonth()+1;
    this.ReportView();
  }

  ReportView() {
    this.DA.ReportMonthlyLoad(this.yearSelected, this.monthSelected)
  }

  SelectItem(item: ReportInfo) {
    this.DL.Report = item;
    this.DL.LoadFromLink("report-detail");
  }

  getDate(keyDay: number): Date {
    return this.core.numberToDate(parseInt(keyDay + '000000'))
  }

  ngOnInit() {
    this.DL.TITLE = "Daily Cashflows";
  }
}
