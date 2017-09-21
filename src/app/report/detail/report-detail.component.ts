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
  selectedDate: Date;
  model: ReportInfo;
  isNew: boolean;
  
  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    if(this.DL.Report) {
      this.isNew = false;
      this.model = Object.assign({}, this.DL.Report);
      this.selectedDate = this.core.keyDayToDate(this.model.KeyDay);
    }
    else {
      this.isNew = true;
      this.model = new ReportInfo();
      this.selectedDate = new Date();
    }
  }

  Save() {
    if(this.isNew) {
      this.model.KeyDay = this.core.dateToKeyDay(this.selectedDate);
      this.model.KeyMonth = this.core.dateToKeyMonth(this.selectedDate);
      this.model.KeyYear = this.selectedDate.getFullYear();
      this.DA.ReportGenerate(this.model.KeyYear, this.model.KeyMonth, this.model.KeyDay, this.model.COHStart, this.model.COHActual);
      this.DL.Display("Cashflow Generation", "Issued!");
    }
    else {
      this.DA.ReportSave(this.model);
      this.DL.Display("Cashflow", "Saved!");
    }

    this.LoadList();
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
    return this.core.keyDayToDate(keyDay);
  }

  ngOnInit() {
    this.DL.TITLE = "Cashflow Details";
  }
}
