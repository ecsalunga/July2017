import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { SnapshotInfo, NameValue } from '../../data/models';

@Component({
  selector: 'snapshot-detail',
  templateUrl: './snapshot-detail.component.html',
  styleUrls: ['./snapshot-detail.component.css']
})
export class SnapshotDetailComponent implements OnInit {
  model: SnapshotInfo;
  
  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    if (this.DL.Snapshot)
      this.model = Object.assign({}, this.DL.Snapshot);
    else {
      this.model = new SnapshotInfo();
      this.model.UserKey = this.DL.User.key;
      this.model.UserName = this.DL.User.Name;
      this.model.KeyDay = this.DL.ReportToday.KeyDay;
      
      let start = 0;
      if(this.DL.ReportToday.COHStart)
        start = this.DL.ReportToday.COHStart;

      this.model.COHStart = start;
      this.model.ExpenseAmount = this.DL.ReportToday.ExpenseAmount;
      this.model.SaleAmount = this.DL.ReportToday.SaleAmount;

      this.model.COHComputed = (this.model.COHStart + this.model.SaleAmount) - this.model.ExpenseAmount
      
      this.model.Inventory = new Array<NameValue>();
      this.DL.Products.forEach(product => {
        this.model.Inventory.push(new NameValue(product.Description, product.Quantity));
      });
    }
  }

  Save() {
    this.model.ActionDate = this.DL.GetActionDate();
    this.DA.SnapshotSave(this.model);
    this.LoadList();
    this.DL.Display("Snapshot Details", "Saved!");
  }

  Accept() {
    this.model.ReviewDate = this.DL.GetActionDate();
    this.model.ReviewerKey = this.DL.User.key;
    this.model.ReviewerName = this.DL.User.Name;
    this.DA.SnapshotSave(this.model);
    this.LoadList();
    this.DL.Display("Snapshot Details", "Reviewed!");
  }

  LoadList() {
    this.DL.LoadFromLink("snapshot-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Snapshot Details";
  }
}
