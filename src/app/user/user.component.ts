import { Component, OnInit } from '@angular/core';

import { Core } from '../core';
import { DataAccess, DataLayer } from '../data';
import { UserInfo, NameValue } from '../models';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  selectedUser: UserInfo;
  selectedAccess: NameValue;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {}

  GetAccessName(accessTypeID: number) : string {
    let access:string = "GUEST";
    this.DL.AccessTypes.forEach(a => {
      if(a.Value == accessTypeID)
        access = a.Name;
    });    

    return access;
  }

  SetAccess() {
    this.selectedUser.AccessTypeID = this.selectedAccess.Value;
    this.DA.UserSave(this.selectedUser);
    
    this.selectedUser = null;
    this.selectedAccess = null;
  }

  ngOnInit() {
    this.DL.TITLE = "User Access";
  }
}
