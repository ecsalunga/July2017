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
  
  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {
      this.model = Object.assign({}, this.DL.SystemSetting);
  }

  Save() {
    this.DA.SystemSettingSave(this.model);
    this.DL.Display("System Settings", "Saved!");
  }

  ngOnInit() {
    this.DL.TITLE = "System Settings";
  }
}
