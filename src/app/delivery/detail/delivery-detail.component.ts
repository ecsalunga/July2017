import { Component, OnInit, ApplicationRef } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { DeliveryInfo, UserInfo } from '../../models';

@Component({
  selector: 'delivery-detail',
  templateUrl: './delivery-detail.component.html',
  styleUrls: ['./delivery-detail.component.css']
})
export class DeliveryDetailComponent implements OnInit {
  model: DeliveryInfo;
  selectedUser: UserInfo;
  selectedStatus: string;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {
    this.model = Object.assign({}, this.DL.Delivery);
    this.selectedStatus = this.model.Status;
    this.DL.UserSelections.forEach(item => {
      if(item.key == this.model.UserKey)
        this.selectedUser = item;
    });
  }

  Assign() {
    this.model.UserKey = this.selectedUser.key;
    this.model.UserName = this.selectedUser.Name;
    this.DL.DeliveryUpdateStatus(this.model, this.DL.STATUS_ASSIGNED);
  }

  Save() {
    let isAssign = false;
    if(this.selectedUser.key != this.DL.Delivery.UserKey) {
      isAssign = true;
      this.Assign();
    }

    if(this.selectedStatus != this.DL.Delivery.Status && !(isAssign && this.selectedStatus == this.DL.STATUS_ASSIGNED))
      this.DL.DeliveryUpdateStatus(this.model, this.selectedStatus);

    this.DA.DeliverySave(this.model);
    this.LoadList();
  }

  getDate(actionDate: number): Date {
    return this.core.numberToDate(actionDate);
  }

  LoadList() {
    this.DL.LoadFromLink("delivery-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Delivery Details";
  }
}