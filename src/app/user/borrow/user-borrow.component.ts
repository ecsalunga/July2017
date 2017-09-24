import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer } from '../../data';
import { UserInfo } from '../../data/models';

@Component({
  selector: 'user-borrow',
  templateUrl: './user-borrow.component.html',
  styleUrls: ['./user-borrow.component.css']
})
export class UserBorrowComponent implements OnInit {
  constructor(private core: Core, public DL: DataLayer) {}
  
  SelectItem(item: UserInfo) {
    this.DL.UserSelected = item;
    this.DL.LoadFromLink("user-borrow-detail");
  }

  AddItem(){
    this.DL.UserSelected = null;
    this.DL.LoadFromLink("user-borrow-detail");
  }

  ngOnInit() { 
    this.DL.TITLE = "Borrow List";
  }
}
