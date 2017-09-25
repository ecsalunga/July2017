import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { SnapshotInfo, Name2Value, ProductInfo } from '../../data/models';

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
      this.model.KeyDay = this.DL.KeyDay;

      this.model.Inventory = new Array<Name2Value>();
      this.model.Borrow = new Array<Name2Value>();
      this.DL.Products.forEach(product => {
        if(product.SupportSnapshot) {
          this.model.Count += product.Quantity;
          this.model.Total += (product.Quantity * product.Price);
          this.model.Inventory.push(new Name2Value(product.Description, product.Quantity, product.Price));
          this.getBorrow(product);
        }
      });
    }
  }

  getBorrow(product: ProductInfo) {
    if(this.DL.UserBorrow != null && this.DL.UserBorrow.length > 0) {
      let entry = new Name2Value(product.Description, 0, product.Price)
      this.DL.UserBorrow.forEach(user => {
        user.Borrows.forEach(b => {
          if(b.Code == product.Code)
            entry.Value1 += b.Count;
        });
      });

      if(entry.Value1 > 0) {
        this.model.BorrowCount += entry.Value1;
        this.model.BorrowTotal += (entry.Value1 * product.Price);
        this.model.Borrow.push(entry);
      }
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
