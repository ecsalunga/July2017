import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { SubscriptionInfo, QuotaInfo } from '../../data/models';

@Component({
  selector: 'subscription-quota',
  templateUrl: './subscription-quota.component.html',
  styleUrls: ['./subscription-quota.component.css']
})
export class SubscriptionQuotaComponent implements OnInit {
  model: SubscriptionInfo;
  FromDate: Date;
  ToDate: Date;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    this.FromDate = this.DL.Date;
    this.ToDate = this.DL.Date;
  }

  SelectItem(item: QuotaInfo) {
    this.DL.SubscriptionQuota = item;
    this.DL.LoadFromLink("subscription-quota-detail");
  }

  Generate() {
    let quota = new QuotaInfo()
    quota.SubscriptionKey = this.model.key;
    quota.SubscriptionName = this.model.Name;
    quota.Products = this.model.Products.filter(product => (product.Quota > 0));
    quota.Subscribers = this.model.Subscribers;
    quota.ActionDate = this.DL.GetActionDate();
    quota.From = this.core.dateToKeyDay(this.FromDate);
    quota.To = this.core.dateToKeyDay(this.ToDate);

    this.DA.SubscriptionQuotaGenerate(quota);
    this.DL.Display("Quota Generation", "Issued!");
  }

  CanGenerate(): boolean {
    if(!this.FromDate || !this.ToDate || !this.model)
      return false;

    if(this.core.dateToKeyDay(this.ToDate) < this.core.dateToKeyDay(this.FromDate))
      return false;

    if(this.core.dateToKeyDay(this.FromDate) > this.DL.KeyDay || this.core.dateToKeyDay(this.ToDate) > this.DL.KeyDay)
      return false

    let timeDiff = Math.abs(this.FromDate.getTime() - this.ToDate.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    if(diffDays > 31)
      return false;

    return true;
  }

  GetDate(dateNumber: number): Date {
    return this.core.numberToDate(dateNumber);
  }

  GetDay(keyDay: number): Date {
    return this.core.keyDayToDate(keyDay);
  }
 
  LoadList() {
    this.DL.LoadFromLink("subscription-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Quota Report";
  }
}
