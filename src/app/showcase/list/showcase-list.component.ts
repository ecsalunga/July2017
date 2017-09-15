import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer } from '../../data';
import { ShowcaseInfo } from '../../data/models';

@Component({
  selector: 'showcase-list',
  templateUrl: './showcase-list.component.html',
  styleUrls: ['./showcase-list.component.css']
})
export class ShowcaseListComponent implements OnInit {

  constructor(private core: Core, public DL: DataLayer) {}

  SelectShowcase(showcase: ShowcaseInfo) {
    this.DL.Showcase = showcase;
    this.DL.LoadFromLink("showcase-detail");
  }

  ScheduleShowcase(showcase: ShowcaseInfo) {
    this.DL.Showcase = showcase;
    this.DL.LoadFromLink("showcase-schedule");
  }

  AddItem() {
    this.DL.Showcase = null;
    this.DL.LoadFromLink("showcase-detail");
  }

  Visibility(showcase: ShowcaseInfo): string {
    let visible = "No";
    let keyToday: number = this.core.dateToKeyDay(this.DL.Date);
    if (showcase.Schedules) {
      let hasToday: boolean = false;
      showcase.Schedules.forEach(item => {
          if (item.From <= keyToday && item.To >= keyToday)
              hasToday = true;
      });

      if (hasToday)
        visible = "Yes";
    }

    return visible;
  }

  ngOnInit() {
    this.DL.TITLE = "Showcase List";
  }
}
