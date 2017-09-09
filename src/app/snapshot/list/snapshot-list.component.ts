import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { SnapshotInfo, ReportInfo } from '../../data/models';

@Component({
  selector: 'snapshot-list',
  templateUrl: './snapshot-list.component.html',
  styleUrls: ['./snapshot-list.component.css']
})
export class SnapshotListComponent implements OnInit {
  selectedDate: Date = new Date();

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {
    if(this.DL.SOURCE == this.DL.MENU) {
      this.loadSnapshots(this.DL.ReportToday.KeyDay);
    }

    this.selectedDate = this.core.numberToDate(parseInt(this.DL.ReportSelected.KeyDay + '000000'));
  }

  loadSnapshots(keyDay: number) {
    this.DL.ReportSelected = new ReportInfo();
    this.DL.ReportSelected.KeyDay = this.core.dateToKeyDay(this.selectedDate);
    this.DA.SnapshotLoad(keyDay);
  }

  AddItem() {
    this.DL.Snapshot = null;
    this.DL.LoadFromLink("snapshot-detail");
  }

  SelectItem(item: SnapshotInfo) {
    this.DL.Snapshot = item;
    this.DL.LoadFromLink("snapshot-detail");
  }

  loadSnapshot() {
    this.loadSnapshots(this.core.dateToKeyDay(this.selectedDate));
  }

  ngOnInit() {
    this.DL.TITLE = "Snapshot List";
  }
}
