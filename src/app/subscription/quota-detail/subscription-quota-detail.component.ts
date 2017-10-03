import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { QuotaInfo } from '../../data/models';

@Component({
  selector: 'subscription-quota-detail',
  templateUrl: './subscription-quota-detail.component.html',
  styleUrls: ['./subscription-quota-detail.component.css']
})
export class SubscriptionQuotaDetailComponent implements OnInit {
  model: QuotaInfo;
  quotaOnly: boolean = false;
  needReminder: boolean = false;
  hasProduct: boolean = false;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    this.model = this.DL.SubscriptionQuota;
    if(this.model.Products != null && this.model.Products.length > 0)
      this.hasProduct = true;
  }

  GetDay(keyDay: number): Date {
    return this.core.keyDayToDate(keyDay);
  }

  InQuota(name: string): boolean {
    let inQuota = false;
    if(this.hasProduct) {
      this.model.Products.forEach(p => {
        if(p.Name == name)
          inQuota = true;
      });
    }
    return inQuota;
  }

  Delete() {
    this.DA.SubscriptionQuotaDelete(this.model);
    this.LoadList();
    this.DL.Display("Purchase Report", "Deleted!");
  }
 
  LoadList() {
    this.DL.LoadFromLink("subscription-quota");
  }

  ngOnInit() {
    this.DL.TITLE = "Purchase Report Details";
  }
}
