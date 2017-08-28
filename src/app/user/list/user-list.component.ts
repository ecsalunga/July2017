import { Component, OnInit } from '@angular/core';
import { DataAccess, DataLayer } from '../../data';
import { UserInfo, Access } from '../../models';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  selectedUser: UserInfo;
  selectedAccess: Access;

  constructor(private DA: DataAccess, private DL: DataLayer) {}
  
  AccessSet() {
    this.selectedUser.AccessKey = this.selectedAccess.key;
    this.selectedUser.AccessName = this.selectedAccess.Name;

    this.DA.UserSave(this.selectedUser);
    
    this.selectedUser = null;
    this.selectedAccess = null;
  }

  ngOnInit() {
    this.DL.TITLE = "User List";
  }
}
