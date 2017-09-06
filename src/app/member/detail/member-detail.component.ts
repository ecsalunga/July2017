import { Component, OnInit, ApplicationRef } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { UserInfo } from '../../models';

@Component({
  selector: 'member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  joinDate: Date;
  model: UserInfo;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {
    if (this.DL.UserSelected) {
      this.model = Object.assign({}, this.DL.UserSelected);
      this.joinDate = this.core.numberToDate(this.model.JoinDate);
    }
    else {
      this.model = new UserInfo();
      this.model.IsMember = true;
      this.joinDate = this.DL.Date;
    }
  }

  Save() {
    this.model.JoinDate = this.core.dateToNumber(this.joinDate);
    this.DA.UserSave(this.model);
    this.LoadList();
    this.DL.Display("Member Details", "Saved!");
  }

  LoadList() {
    this.DL.LoadFromLink("member-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Member Details";
  }
}
