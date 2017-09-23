import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ShowcaseInfo, ScheduleInfo } from '../../data/models';

@Component({
  selector: 'showcase-schedule',
  templateUrl: './showcase-schedule.component.html',
  styleUrls: ['./showcase-schedule.component.css']
})
export class ShowcaseScheduleComponent implements OnInit {
  FromDate: Date;
  ToDate: Date;
  ToDay: Date;
  model: ShowcaseInfo;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    // workaround for array property deep clone issue
    this.model = new ShowcaseInfo(this.DL.DefaultImageURL);
    this.model.ProductCode = this.DL.Showcase.ProductCode;
    this.model.ProductName = this.DL.Showcase.ProductName;
    this.model.Description = this.DL.Showcase.Description;
    this.model.ImageURL = this.DL.Showcase.ImageURL;
    this.model.Order = this.DL.Showcase.Order;
    this.model.key = this.DL.Showcase.key;
    if(this.DL.Showcase.Schedules) {
      this.DL.Showcase.Schedules.forEach(s => {
        let item = new ScheduleInfo();
        item.From = s.From;
        item.To = s.To;
        this.model.Schedules.push(item);
      });
    }
    this.ToDay = new Date();
    this.FromDate = this.ToDay;
    this.ToDate = this.ToDay;
  }

  GetDate(keyDay: number): Date {
    return this.core.keyDayToDate(keyDay);
  }

  AddSchedule() {
    let schedule = new ScheduleInfo();
    schedule.From = this.core.dateToKeyDay(this.FromDate);
    schedule.To = this.core.dateToKeyDay(this.ToDate);
    this.model.Schedules.push(schedule);
    this.model.Schedules.sort((item1, item2) => item1.From - item2.From);
  }

  Delete(info: ScheduleInfo) {
    this.model.Schedules = this.model.Schedules.filter(s => !(s.From == info.From && s.To == info.To));
  }

  Save() {
    this.DA.ShowcaseSave(this.model);
    this.LoadList();
    this.DL.Display("Showcase Schedule", "Saved!");
  }

  CanAdd(): boolean {
    return (this.core.dateToKeyDay(this.ToDate) >= this.core.dateToKeyDay(this.FromDate) 
      && this.core.dateToKeyDay(this.ToDate) >= this.core.dateToKeyDay(this.ToDay));
  }

  LoadList() {
    this.DL.LoadFromLink("showcase-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Showcase Schedule";
  }
}
