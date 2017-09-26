import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { SubscriptionInfo } from '../../data/models';

@Component({
  selector: 'subscription-detail',
  templateUrl: './subscription-detail.component.html',
  styleUrls: ['./subscription-detail.component.css']
})
export class SubscriptionDetailComponent implements OnInit {
  model: SubscriptionInfo;
  isLoaded: boolean = true;
  hasDuplicate: boolean;

  codeValidator = new FormControl('', [Validators.required]);
  nameValidator = new FormControl('', [Validators.required]);
  priceValidator = new FormControl('', [Validators.required]);

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    if (this.DL.Subscription)
      this.model = Object.assign({}, this.DL.Subscription);
    else
      this.model = new SubscriptionInfo(this.DL.DefaultImageURL);
  }

  CanSave(): boolean {
    if(this.codeValidator.invalid || this.nameValidator.invalid || this.priceValidator.invalid)
      return false;
    
    if(this.model.key && !this.DL.UserAccess.SubscriptionEdit)
      return false;

    if(!this.model.key && !this.DL.UserAccess.SubscriptionAdd)
      return false;

    return true;
  }

  SelectFile() {
    this.DL.SelectImage("images/subscription/");
  }

  ImageLoaded() {
    this.isLoaded = true;
  }

  CodeChange() {
    this.hasDuplicate = false;
  }

  Save() {
    let validated = this.hasDuplicate;
    this.hasDuplicate = false;

    if(!validated) {
      this.DL.Subscriptions.forEach(item => {
        if(this.model.Code == item.Code && this.model.key != item.key) {
          this.hasDuplicate = true;
        }
      });

      if(!this.hasDuplicate)
        validated = true;
      else
        this.DL.DisplayLong("Duplicate Code", "Save again to proceed.");
    }

    if(validated) {
      this.DA.SubscriptionSave(this.model);
      this.LoadList();
      this.DL.Display("Subscription Details", "Saved!");
    }
  }

  LoadList() {
    this.DL.LoadFromLink("subscription-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Subscription Details";

    this.DA.ImageUploaded.subscribe(url => {
      this.model.ImageURL = url;
    });
    this.DA.DataChecked.subscribe(isValid => {
      if(isValid) 
        this.isLoaded = false;
    });
  }
}
