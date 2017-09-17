import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ServiceInfo } from '../../data/models';

@Component({
  selector: 'service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  model: ServiceInfo;
  isLoaded: boolean = true;
  hasDuplicate: boolean;

  codeValidator = new FormControl('', [Validators.required]);
  nameValidator = new FormControl('', [Validators.required]);
  priceValidator = new FormControl('', [Validators.required]);

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    if (this.DL.Service)
      this.model = Object.assign({}, this.DL.Service);
    else
      this.model = new ServiceInfo(this.DL.DefaultImageURL);
  }

  CanSave(): boolean {
    if(this.codeValidator.invalid || this.nameValidator.invalid || this.priceValidator.invalid)
      return false;
    
    if(this.model.key && !this.DL.UserAccess.ServiceEdit)
      return false;

    if(!this.model.key && !this.DL.UserAccess.ServiceAdd)
      return false;

    return true;
  }

  SelectFile() {
    this.DL.SelectImage("images/service/");
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
      this.DL.Services.forEach(item => {
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
      this.DA.ServiceSave(this.model);
      this.LoadList();
      this.DL.Display("Service Details", "Saved!");
    }
  }

  LoadList() {
    this.DL.LoadFromLink("service-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Service Details";

    this.DA.ImageUploaded.subscribe(url => {
      this.model.ImageURL = url;
    });
    this.DA.DataChecked.subscribe(isValid => {
      if(isValid) 
        this.isLoaded = false;
    });
  }
}
