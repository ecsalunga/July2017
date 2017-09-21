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

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    if(this.DL.SOURCE == this.DL.MENU) {
      this.LoadSnapshots(this.DL.KeyDay);
    }

    this.selectedDate = this.core.keyDayToDate(this.DL.ReportSelected.KeyDay);
  }

  LoadSnapshots(keyDay: number) {
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

  LoadSnapshot() {
    this.LoadSnapshots(this.core.dateToKeyDay(this.selectedDate));
  }

  ngOnInit() {
    this.DL.TITLE = "Snapshot List";
  }
}
