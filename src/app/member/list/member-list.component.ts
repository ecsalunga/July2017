import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer } from '../../data';
import { MemberInfo } from '../../models';

@Component({
  selector: 'member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  constructor(private core: Core, private DL: DataLayer) {}

  SelectMember(member: MemberInfo) {
    this.DL.Member = member;
    this.core.loadComponent("member-detail");
  }

  AddMember(){
    this.DL.Member = null;
    this.core.loadComponent("member-detail");
  }

  ngOnInit() { }

}
