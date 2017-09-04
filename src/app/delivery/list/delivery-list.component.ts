import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer, DataAccess } from '../../data';
import { DeliveryInfo } from '../../models';

@Component({
  selector: 'delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css']
})
export class DeliveryListComponent implements OnInit {
  constructor(private core: Core, private DL: DataLayer, private DA: DataAccess) {}
  
  Select(item: DeliveryInfo) {
    this.DL.Delivery = item;
    this.DL.LoadFromLink("delivery-detail");
  }

  Visible(item: DeliveryInfo): boolean {
    let view = true;
    if(!this.DL.UserAccess.DeliveryDoneView && (item.Status == this.DL.STATUS_DELIVERED || item.Status == this.DL.STATUS_CANCELLED))
      view = false;

    return view;
  }

  IsLate(item: DeliveryInfo): boolean {
    let late = false;
    if(this.DL.Setting.DeliveryMaxMinutes && this.DL.Setting.DeliveryMaxMinutes > 0) {
      if(item.Status == this.DL.STATUS_DELIVERED || item.Status == this.DL.STATUS_CANCELLED)
        late = (item.ActionLast - item.ActionStart > this.DL.Setting.DeliveryMaxMinutes * 100);
      else
        late = (this.DL.GetActionDate() - item.ActionStart > this.DL.Setting.DeliveryMaxMinutes * 100);
    } 

    return late;
  }

  HasClean(): boolean {
    let hasClean = false
    this.DL.DeliveryInfos.forEach(item => {
      if(item.Status == this.DL.STATUS_DELIVERED || item.Status == this.DL.STATUS_CANCELLED)
        hasClean = true;
    });

    return hasClean;
  }

  CleanDelete() {
    this.DL.DeliveryInfos.forEach(item => {
      if(item.Status == this.DL.STATUS_DELIVERED || item.Status == this.DL.STATUS_CANCELLED)
        this.DA.DeliveryDelete(item);
    });
  }

  getDate(actionDate: number): Date {
    return this.core.numberToDate(actionDate);
  }

  ngOnInit() { 
    this.DL.TITLE = "Delivery List";
  }
}
