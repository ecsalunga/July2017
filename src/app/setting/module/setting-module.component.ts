import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ModuleSettingInfo } from '../../models';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'setting-module',
  templateUrl: './setting-module.component.html',
  styleUrls: ['./setting-module.component.css']
})
export class SettingModuleComponent implements OnInit {
  model: ModuleSettingInfo;
  
  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer, public snackBar: MdSnackBar) {
      this.model = Object.assign({}, this.DL.ModuleSetting);
  }

  Save() {
    this.DA.ModuleSettingSave(this.model);
    this.snackBar.open("System Settings", "Saved!", {
      duration: 3000,
    });
  }

  ngOnInit() {
    this.DL.TITLE = "Module Settings";
  }
}
