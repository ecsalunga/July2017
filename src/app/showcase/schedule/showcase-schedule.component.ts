import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ShowcaseInfo, ScheduleInfo } from '../../models';

@Component({
  selector: 'showcase-schedule',
  templateUrl: './showcase-schedule.component.html',
  styleUrls: ['./showcase-schedule.component.css']
})
export class ShowcaseScheduleComponent implements OnInit {
  FromDate: Date;
  ToDate: Date;
  model: ShowcaseInfo;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {
    this.model = Object.assign({}, this.DL.Showcase);
  }

  getDate(keyDay: number): Date {
    return this.core.numberToDate(parseInt(keyDay + '000000'))
  }

  AddSchedule() {
    let schedule = new ScheduleInfo();
    schedule.From = this.core.dateToKeyDay(this.FromDate);
    schedule.To = this.core.dateToKeyDay(this.ToDate);
    this.model.Schedules.push(schedule);
  }

  Delete(info: ScheduleInfo) {
    this.model.Schedules = this.model.Schedules.filter(s => s.From != info.From && s.To != info.To);
  }

  Save() {
    this.DA.ShowcaseSave(this.model);
    this.LoadList();
  }

  LoadList() {
    this.DL.LoadFromLink("showcase-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Showcase Schedule";
  }
}
