import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer } from '../../data';
import { DeliveryInfo } from '../../models';

@Component({
  selector: 'delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css']
})
export class DeliveryListComponent implements OnInit {
  constructor(private core: Core, private DL: DataLayer) {}
  
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

  getDate(actionDate: number): Date {
    return this.core.numberToDate(actionDate);
  }

  ngOnInit() { 
    this.DL.TITLE = "Delivery List";
  }
}
