import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ReportInfo } from '../../data/models';

@Component({
  selector: 'report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.css']
})
export class ReportDetailComponent implements OnInit {
  model: ReportInfo;
  
  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
      this.model = Object.assign({}, this.DL.Report);
  }

  Save() {
    this.DA.ReportSave(this.model);
    this.LoadList();
    this.DL.Display("Cash Balancing Details", "Saved!");
  }

  LoadList() {
    this.DL.LoadFromLink("report-list");
  }

  Regenerate() {
    this.DA.ReportReGenerate(this.model.KeyYear, this.model.KeyMonth, this.model.KeyDay);
    this.LoadList();
    this.DL.Display("Cashflow Regeneration", "Issued!");
  }

  GetComputed() : number {
    let start = 0;
    if(this.model.COHStart)
      start = this.model.COHStart;

    return ((start + this.model.SaleAmount) - this.model.ExpenseAmount)
  }

  GetDate(keyDay: number): Date {
    return this.core.numberToDate(parseInt(keyDay + '000000'))
  }

  ngOnInit() {
    this.DL.TITLE = "Cash Balancing Details";
  }
}
