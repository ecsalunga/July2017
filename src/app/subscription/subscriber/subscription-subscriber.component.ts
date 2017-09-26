import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { SubscriptionInfo, UserInfo, Name2Value } from '../../data/models';

@Component({
  selector: 'subscription-subscriber',
  templateUrl: './subscription-subscriber.component.html',
  styleUrls: ['./subscription-subscriber.component.css']
})
export class SubscriptionSubscriberComponent implements OnInit {
  model: SubscriptionInfo;
  selectedMember: UserInfo;
  subscribers: Array<Name2Value>;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    this.subscribers = new Array<Name2Value>();
    this.model = Object.assign({}, this.DL.Subscription);
    if(this.model.Subscribers != null && this.model.Subscribers.length > 0) {
      this.model.Subscribers.forEach(sub => {
        this.subscribers.push(sub);
      });
    }
  }

  CanSave(): boolean {
    if(!this.DL.UserAccess.SubscriptionSubscriberAdd && !this.DL.UserAccess.SubscriptionSubscriberDelete)
      return false;

    return true;
  }

  GetDate(dateNumber: number): Date {
    return this.core.numberToDate(dateNumber);
  }

  AddItem() {
    let item = new Name2Value(this.selectedMember.Name, this.selectedMember.key, this.DL.GetActionDate() );
    this.subscribers.push(item);
    this.subscribers.sort((item1, item2) => item1.Name.localeCompare(item2.Name));
    this.ClearSelection();
  }

  Delete(item: Name2Value) {
    this.subscribers = this.subscribers.filter(s => !(s.Value1 == item.Value1));
  }

  ClearSelection() {
    this.selectedMember = null;
  }

  Save() {
    this.model.Subscribers = this.subscribers;
    this.DA.SubscriptionSave(this.model);
    this.DL.Display("Subscriber", "Saved!");
    this.LoadList();
  }

  Exists(member: UserInfo): boolean {
    let exists = false;
    this.subscribers.forEach(item => {
      if(item.Value1 == member.key)
        exists = true;
    });
    return exists;
  }
 
  LoadList() {
    this.DL.LoadFromLink("subscription-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Subscriber List";
  }
}
