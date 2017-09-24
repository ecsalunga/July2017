import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ExpenseInfo, NameValue } from '../../data/models';

@Component({
  selector: 'report-expense-detail',
  templateUrl: './report-expense-detail.component.html',
  styleUrls: ['./report-expense-detail.component.css']
})
export class ReportExpenseDetailComponent implements OnInit {
  selectedDate: Date;
  selectedType: NameValue;
  isNew: boolean;
  model: ExpenseInfo;
  
  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    if(this.DL.Expense) {
      this.model = Object.assign({}, this.DL.Expense);
      this.selectedDate = this.core.keyDayToDate(this.model.KeyDay);
      this.isNew = false;
      this.DL.ExpenseTypes.forEach(item => {
        if(this.model.TypeKey == item.Value)
          this.selectedType = item;
      });
    } else {
      this.model = new ExpenseInfo();
      this.selectedDate = new Date();
      this.isNew = true;
    }
  }

  Save() {
    this.model.UserKey = this.DL.User.key;
    this.model.UserName = this.DL.User.Name;

    this.model.TypeName = this.selectedType.Name;
    this.model.TypeKey = this.selectedType.Value;

    this.model.ActionDate = this.DL.GetActionDate();
    this.model.KeyDay = this.core.dateToKeyDay(this.selectedDate);
    this.model.KeyMonth = this.core.dateToKeyMonth(this.selectedDate);
    this.model.KeyYear = this.selectedDate.getFullYear();

    this.DA.ExpenseInfoSave(this.model);
    this.DL.Display("Expense", "Saved!");
    this.LoadList();
  }

  Delete() {
    this.DA.ExpenseDelete(this.model);
    this.DL.Display("Expense", "Deleted!");
    this.LoadList();
  }

  LoadList() {
    this.DL.LoadFromLink("report-expense");
  }

  ngOnInit() {
    this.DL.TITLE = "Expense Details";
  }
}
