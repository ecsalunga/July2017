import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { OrderInfo } from '../../data/models';

@Component({
  selector: 'product-order-detail',
  templateUrl: './product-order-detail.component.html',
  styleUrls: ['./product-order-detail.component.css']
})
export class ProductOrderDetailComponent implements OnInit {
  model: OrderInfo;
  selectedStatus: string;

  constructor(private core: Core, public DL: DataLayer, private DA: DataAccess) { 
    this.model = Object.assign({}, this.DL.ShowcaseOrder);
    this.selectedStatus = this.model.Status;
  }

  ShowDeliveryOption(): boolean {
    return (!this.model.HasDelivery 
      && this.model.Status != this.DL.STATUS_SELECTING 
      && this.model.Status != this.DL.STATUS_CANCELLED 
      && this.model.Status != this.DL.STATUS_DONE);
  }

  ShowForTransaction(): boolean {
    return (!this.model.HasDelivery && !this.model.IsTransaction && this.model.Status == this.DL.STATUS_DONE);
  }

  GenerateTransaction() {
    this.DA.ShowcaseOrderToTransaction(this.model);
    this.DL.StatusInject(this.model, this.DL.STATUS_SAVEDTO_TRANSACT);
    this.model.IsTransaction = true;
    this.DA.ShowcaseOrderSave(this.model);
    this.LoadList();
    this.DL.Display("Transaction", "Saved!");
  }

  CanSave(): boolean {
    return (this.DL.UserAccess.ShowcaseOrderEdit && 
      !(this.model.Status == this.DL.STATUS_SELECTING 
        || this.model.Status == this.DL.STATUS_CANCELLED
        || this.model.Status == this.DL.STATUS_DONE));
  }

  CanDelete(): boolean {
    return (this.model.Status == this.DL.STATUS_CANCELLED 
      || (this.model.Status == this.DL.STATUS_DONE && (this.model.IsTransaction || this.model.HasDelivery)));
  }

  Save() {
    if(this.DL.ShowcaseOrder.Status != this.selectedStatus) {
      this.DL.StatusUpdate(this.model, this.selectedStatus);
      this.DA.ShowcaseOrderSave(this.model);
      this.DL.Display("Order", "Saved!");
      this.LoadList();
    }
  }

  Delete() {
    this.DA.ShowcaseOrderDelete(this.model);
    this.DL.Display("Order", "Deleted!");
    this.LoadList();
  }

  CreateDelivery() {
    this.DL.StatusInject(this.model, this.DL.STATUS_DELIVERY_CREATED);
    this.DL.StatusUpdate(this.model, this.DL.STATUS_FOR_DELIVERY);
    this.model.HasDelivery = true;
    this.DA.ShowcaseOrderSave(this.model);
    this.DA.ShowcaseOrderForDelivery(this.model);
    this.selectedStatus = this.DL.STATUS_FOR_DELIVERY;
    this.DL.Display("Delivery Info", "Created!");
  }
  
  GetDate(keyDay: number): Date {
    return this.core.numberToDate(keyDay);
  }

  LoadList() {
    this.DL.LoadFromLink("product-order");
  }

  BackToCart() {
    this.DL.LoadFromLink("showcase-cart");
  }

  ngOnInit() {
    this.DL.TITLE = "Order Details";
  }
}
