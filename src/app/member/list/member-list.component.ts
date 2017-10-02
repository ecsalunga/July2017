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
  
  constructor(private core: Core, public DL: DataLayer) {}

  SelectItem(item: UserInfo) {
    this.DL.UserSelected = item;
    this.DL.LoadFromLink("member-detail");
  }

  AddItem(){
    this.DL.UserSelected = null;
    this.DL.LoadFromLink("member-detail");
  }

  ngOnInit() { 
    this.DL.TITLE = "Member List";
  }
}
