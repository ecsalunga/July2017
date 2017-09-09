import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer } from '../../data';
import { UserInfo } from '../../data/models';

@Component({
  selector: 'member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  constructor(private core: Core, private DL: DataLayer) {}

  SelectMember(member: UserInfo) {
    this.DL.UserSelected = member;
    this.DL.LoadFromLink("member-detail");
  }

  AddMember(){
    this.DL.UserSelected = null;
    this.DL.LoadFromLink("member-detail");
  }

  ngOnInit() { 
    this.DL.TITLE = "Member List";
  }
}
