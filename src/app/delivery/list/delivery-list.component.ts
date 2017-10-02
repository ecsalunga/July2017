import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer, DataAccess } from '../../data';
import { DeliveryInfo } from '../../data/models';

@Component({
  selector: 'delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css']
})
export class DeliveryListComponent implements OnInit {
  constructor(private core: Core, public DL: DataLayer, private DA: DataAccess) {}
  
  Select(item: DeliveryInfo) {
    this.DL.Delivery = item;
    this.DL.LoadFromLink("delivery-detail");
  }

  Visible(item: DeliveryInfo): boolean {
    let view = true;
    if(!this.DL.UserAccess.DeliveryDoneView && ((item.Status == this.DL.STATUS_DELIVERED && item.IsTransaction) || item.Status == this.DL.STATUS_CANCELLED))
      view = false;

    return view;
  }

  IsLate(item: DeliveryInfo): boolean {
    let late = false;
    if(this.DL.ModuleSetting.DeliveryMaxMinutes && this.DL.ModuleSetting.DeliveryMaxMinutes > 0) {
      let last = new Date();
      let start = this.core.numberToDate(item.ActionStart);
      start.setMinutes(start.getMinutes() + this.DL.ModuleSetting.DeliveryMaxMinutes)

      if(item.Status == this.DL.STATUS_DELIVERED || item.Status == this.DL.STATUS_CANCELLED)
        last = this.core.numberToDate(item.ActionDate);
      
      late = (last > start);
    } 

    return late;
  }

  HasClean(): boolean {
    let hasClean = false
    this.DL.DeliveryInfos.forEach(item => {
      if((item.Status == this.DL.STATUS_DELIVERED && item.IsTransaction) || item.Status == this.DL.STATUS_CANCELLED)
        hasClean = true;
    });

    return hasClean;
  }

  CleanDelete() {
    this.DL.DeliveryInfos.forEach(item => {
      if((item.Status == this.DL.STATUS_DELIVERED && item.IsTransaction) || item.Status == this.DL.STATUS_CANCELLED)
        this.DA.DeliveryDelete(item);
    });

    this.DL.Display("Delivery", "Done Status Cleared!");
  }

  GetDate(actionDate: number): Date {
    return this.core.numberToDate(actionDate);
  }

  ngOnInit() {
    this.DL.TITLE = "Delivery List";
  }
}
