import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { SystemSettingInfo } from '../../data/models';

@Component({
  selector: 'setting-system',
  templateUrl: './setting-system.component.html',
  styleUrls: ['./setting-system.component.css']
})
export class SettingSystemComponent implements OnInit {
  model: SystemSettingInfo;
  isLoaded: boolean = true;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
      this.model = Object.assign({}, this.DL.SystemSetting);
  }

  Save() {
    this.DA.SystemSettingSave(this.model);
    this.DL.Display("System Settings", "Saved!");
  }

  SelectFile() {
    this.DL.SelectImage("images/default_");
  }

  ImageLoaded() {
    this.isLoaded = true;
  }

  ngOnInit() {
    this.DL.TITLE = "System Settings";

    this.DA.ImageUploaded.subscribe(url => {
      this.model.DefaultImageURL = url;
    });
    this.DA.DataChecked.subscribe(isValid => {
      if(isValid) 
        this.isLoaded = false;
    });
  }
}
