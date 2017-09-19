import { Component, OnInit } from '@angular/core';
import { DataAccess, DataLayer } from '../../data';
import { UserInfo, AccessInfo } from '../../data/models';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  selectedUser: UserInfo;
  selectedAccess: AccessInfo;

  constructor(private DA: DataAccess, public DL: DataLayer) {}
  
  AccessSet() {
    this.selectedUser.AccessKey = this.selectedAccess.key;
    this.selectedUser.AccessName = this.selectedAccess.Name;

    this.DA.UserSave(this.selectedUser);
    this.DL.Display("User Access", "Set!");
    
    this.selectedUser = null;
    this.selectedAccess = null;
  }

  SelectUser(item: UserInfo) {
    this.DL.UserSelected = item;
    this.DL.LoadFromLink("user-detail");
  }

  ngOnInit() {
    this.DL.TITLE = "User List";
  }
}
