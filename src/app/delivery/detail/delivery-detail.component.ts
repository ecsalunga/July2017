import { Component, OnInit, ApplicationRef } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { DeliveryInfo, UserInfo } from '../../data/models';

@Component({
  selector: 'delivery-detail',
  templateUrl: './delivery-detail.component.html',
  styleUrls: ['./delivery-detail.component.css']
})
export class DeliveryDetailComponent implements OnInit {
  model: DeliveryInfo;
  selectedUser: UserInfo;
  selectedStatus: string;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
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

  IsDone(): boolean {
    return (this.model.Status == this.DL.STATUS_DELIVERED || this.model.Status == this.DL.STATUS_CANCELLED);
  }

  Delete() {
    this.DA.DeliveryDelete(this.model);
    this.LoadList();
    this.DL.Display("Delivery Details", "Deleted!");
  }

  GenerateTransaction() {
    this.DA.DeliveryToTransaction(this.model);
    this.DL.Display("Transaction", "Saved!");
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
    this.DL.Display("Delivery Details", "Saved!");
  }

  GetDate(actionDate: number): Date {
    return this.core.numberToDate(actionDate);
  }

  LoadList() {
    if(this.DL.DeliveryToggledStamp > 0)
      this.DL.LoadFromLink("product-sell");
    else
      this.DL.LoadFromLink("delivery-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Delivery Details";
  }
}