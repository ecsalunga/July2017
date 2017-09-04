import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { SettingInfo } from '../../models';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'system-setting',
  templateUrl: './system-setting.component.html',
  styleUrls: ['./system-setting.component.css']
})
export class SystemSettingComponent implements OnInit {
  model: SettingInfo;
  
  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer, public snackBar: MdSnackBar) {
      this.model = Object.assign({}, this.DL.Setting);
  }

  Save() {
    this.DA.SettingSave(this.model);
    this.snackBar.open("System Settings", "Saved!", {
      duration: 3000,
    });
  }

  ngOnInit() {
    this.DL.TITLE = "System Settings";
  }
}
