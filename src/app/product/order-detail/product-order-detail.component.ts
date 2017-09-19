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

  CanSave(): boolean {
    return (this.DL.UserAccess.ShowcaseOrderEdit && 
      !(this.model.Status == this.DL.STATUS_SELECTING ||  this.model.Status == this.DL.STATUS_DONE));
  }

  Save() {
    if(this.DL.ShowcaseOrder.Status != this.selectedStatus) {
      this.DL.OrderUpdateStatus(this.model, this.selectedStatus);
      this.DA.ShowcaseOrderSave(this.model);

      if(this.selectedStatus == this.DL.STATUS_FOR_DELIVERY) {
        this.DA.ShowcaseOrderForDelivery(this.model);
        this.DL.Display("Delivery Info", "Created!");
      } else {
        this.DL.Display("Order", "Saved!");
        this.LoadList();
      }
    }
    
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
