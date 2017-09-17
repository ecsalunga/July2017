import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer } from '../../data';
import { ServiceInfo } from '../../data/models';

@Component({
  selector: 'service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {

  constructor(private core: Core, public DL: DataLayer) { }
  
    SelectItem(item: ServiceInfo) {
      this.DL.Service = item;
      this.LoadDetail();
    }

    ScheduleItem(item: ServiceInfo) {
      this.DL.Service = item;
      this.DL.LoadFromLink("service-schedule");
    }

    Visibility(item: ServiceInfo): string {
      let visible = "No";
      let keyToday: number = this.core.dateToKeyDay(this.DL.Date);
      if (item.Schedules) {
        let hasToday: boolean = false;
        item.Schedules.forEach(item => {
            if (item.From <= keyToday && item.To >= keyToday)
                hasToday = true;
        });
  
        if (hasToday)
          visible = "Yes";
      }
  
      return visible;
    }
  
    AddItem() {
      this.DL.Service = null;
      this.LoadDetail();
    }

    LoadDetail() {
      this.DL.LoadFromLink("service-detail");
    }
  
    ngOnInit() { 
      this.DL.TITLE = "Service List";
    }
}
