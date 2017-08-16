import { Component, OnInit, ApplicationRef } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { MemberInfo } from '../../models';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  joinDate: Date;
  model: MemberInfo;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {
    if (this.DL.Member) {
      this.model = this.DL.Member;
      this.joinDate = this.core.numberToDate(this.model.JoinDate);
    }
    else
      this.model = new MemberInfo();
  }

  Save() {
    this.model.JoinDate = this.core.dateToNumber(this.joinDate);
    this.DA.MemberSave(this.model);
    this.LoadList();
  }

  LoadList() {
    this.core.loadComponent("app-member-list");
  }

  ngOnInit() {
    
  }

}
