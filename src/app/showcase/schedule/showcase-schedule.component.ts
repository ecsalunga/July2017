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
    // workaround for array property deep clone issue
    this.model = new ShowcaseInfo();
    this.model.Name = this.DL.Showcase.Name;
    this.model.Code = this.DL.Showcase.Code;
    this.model.Description = this.DL.Showcase.Description;
    this.model.ImageURL = this.DL.Showcase.ImageURL;
    this.model.Price = this.DL.Showcase.Price;
    this.model.key = this.DL.Showcase.key;
    if(this.DL.Showcase.Schedules) {
      this.DL.Showcase.Schedules.forEach(s => {
        let item = new ScheduleInfo();
        item.From = s.From;
        item.To = s.To;
        this.model.Schedules.push(item);
      });
    }

    this.FromDate = this.DL.Date;
    this.ToDate = this.DL.Date;
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
