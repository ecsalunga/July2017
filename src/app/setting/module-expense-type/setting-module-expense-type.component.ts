import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { NameValue } from '../../data/models';

@Component({
  selector: 'setting-module-expense-type',
  templateUrl: './setting-module-expense-type.component.html',
  styleUrls: ['./setting-module-expense-type.component.css']
})
export class SettingModuleExpenseTypeComponent implements OnInit {
  name: string;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    this.View();
  }

  View() {
    this.DA.ExpenseLoadTypes();
  }

  Save() {
    this.DA.ExpenseTypeSave(this.name);
    this.name = null;
    this.View();
  }

  Delete(item: NameValue) {
    this.DA.ExpenseTypeDelete(item);
    this.View();
  }

  Back() {
    this.DL.LoadFromLink("setting-module");
  }

  ngOnInit() {
    this.DL.TITLE = "Expense Types";
  }
}
