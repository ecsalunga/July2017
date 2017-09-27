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

  Generate() {
    let quota = new QuotaInfo()
    quota.SubscriptionKey = this.model.key;
    quota.SubscriptionName = this.model.Name;
    quota.Products = this.model.Products;
    quota.ActionDate = this.DL.GetActionDate();
    quota.From = this.core.dateToKeyDay(this.FromDate);
    quota.To = this.core.dateToKeyDay(this.FromDate);

    this.DA.SubscriptionQuotaGenerate(quota);
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
