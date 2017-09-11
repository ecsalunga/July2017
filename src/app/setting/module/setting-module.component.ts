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
  
  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {
      this.model = Object.assign({}, this.DL.ModuleSetting);
  }

  Save() {
    this.DA.ModuleSettingSave(this.model);
    this.DL.Display("Module Settings", "Saved!");
  }

  ShowcaseUpdate() {
    let items = new Array<ShowcaseInfo>();
    this.DL.Showcases.forEach(showcase => {
      this.DL.Products.forEach(product => {
        if(showcase.Product.key == product.key) {
          showcase.Product = product;
        }
      });
      items.push(showcase);
    });

    items.forEach(item => {
      this.DA.ShowcaseSaveOnly(item);
    });

    this.DA.ShowcasesLoad();
    this.DL.Display("Showcase", "Updated!");
  }

  ngOnInit() {
    this.DL.TITLE = "Module Settings";
  }
}
