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

  AddItem() {
    this.DL.UserSelected = null;
    this.DL.LoadFromLink("user-borrow-detail");
  }

  SelectItem(user: UserInfo) {
    this.DL.UserSelected = user;
    this.DL.LoadFromLink("user-borrow-detail");
  }

  HasDueBorrow(item: UserInfo) {
    let hasDue = false;
    item.Borrows.forEach(borrow => {
      if(borrow.ReturnDate <= this.DL.KeyDay)
        hasDue = true;
    });
    return hasDue;
  }

  GetCount(item: UserInfo): number {
    let count = 0;
    item.Borrows.forEach(borrow => {
      count += borrow.Count;
    });
    
    return count;
  }

  ngOnInit() { 
    this.DL.TITLE = "Borrow List";
  }
}
