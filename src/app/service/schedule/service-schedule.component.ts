import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ServiceInfo, ScheduleInfo } from '../../data/models';

@Component({
  selector: 'service-schedule',
  templateUrl: './service-schedule.component.html',
  styleUrls: ['./service-schedule.component.css']
})
export class ServiceScheduleComponent implements OnInit {
  FromDate: Date;
  ToDate: Date;
  ToDay: Date;
  model: ServiceInfo;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    // workaround for array property deep clone issue
    this.model = new ServiceInfo(this.DL.DefaultImageURL);
    this.model.Name = this.DL.Service.Name;
    this.model.Description = this.DL.Service.Description;
    this.model.ImageURL = this.DL.Service.ImageURL;
    this.model.Order = this.DL.Service.Order;
    this.model.key = this.DL.Service.key;
    if(this.DL.Service.Schedules) {
      this.DL.Service.Schedules.forEach(s => {
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
    this.DA.ServiceSave(this.model);
    this.LoadList();
    this.DL.Display("Service Schedule", "Saved!");
  }

  CanAdd(): boolean {
    return (this.core.dateToKeyDay(this.ToDate) >= this.core.dateToKeyDay(this.FromDate) 
      && this.core.dateToKeyDay(this.ToDate) >= this.core.dateToKeyDay(this.ToDay));
  }

  LoadList() {
    this.DL.LoadFromLink("service-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Service Schedule";
  }
}
