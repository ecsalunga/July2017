import { Component, OnInit, ApplicationRef } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { UserInfo } from '../../models';

@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  joinDate: Date;
  model: UserInfo;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {
    this.model = Object.assign({}, this.DL.UserSelected);
    this.joinDate = this.core.numberToDate(this.model.JoinDate);
  }

  Save() {
    this.model.JoinDate = this.core.dateToNumber(this.joinDate);
    this.DA.UserSave(this.model);
    this.LoadList();
  }

  LoadList() {
    this.DL.LoadFromLink("user-list");
  }

  ngOnInit() {
    this.DL.TITLE = "User Details";
  }
}
