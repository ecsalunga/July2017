import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ModuleSettingInfo, ShowcaseInfo } from '../../data/models';

@Component({
  selector: 'setting-module',
  templateUrl: './setting-module.component.html',
  styleUrls: ['./setting-module.component.css']
})
export class SettingModuleComponent implements OnInit {
  model: ModuleSettingInfo;
  
  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
      this.model = Object.assign({}, this.DL.ModuleSetting);
  }

  Save() {
    this.DA.ModuleSettingSave(this.model);
    this.DL.Display("Module Settings", "Saved!");
  }

  ExpenseLoadType() {
    this.DL.LoadFromLink("setting-module-expense-type");
  }

  ngOnInit() {
    this.DL.TITLE = "Module Settings";
  }
}
