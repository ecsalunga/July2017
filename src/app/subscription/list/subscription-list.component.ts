import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer } from '../../data';
import { SubscriptionInfo } from '../../data/models';

@Component({
  selector: 'subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.css']
})
export class SubscriptionListComponent implements OnInit {

  constructor(private core: Core, public DL: DataLayer) {}
  
  SelectItem(item: SubscriptionInfo) {
    this.DL.Subscription = item;
    this.DL.LoadFromLink("subscription-detail");
  }

  Subscriber(item: SubscriptionInfo) {
    this.DL.Subscription = item;
    this.DL.LoadFromLink("subscription-subscriber");
  }

  QuotaReport() {
    this.DL.LoadFromLink("subscription-quota");
  }

  Product(item: SubscriptionInfo) {
    this.DL.Subscription = item;
    this.DL.LoadFromLink("subscription-product");
  }

  AddItem() {
    this.DL.Subscription = null;
    this.DL.LoadFromLink("subscription-detail");
  }

  ngOnInit() {
    this.DL.TITLE = "Subscription List";
  }
}
