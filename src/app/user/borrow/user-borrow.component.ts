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

  Manage() {
    this.DL.LoadFromLink("user-borrow-detail");
  }

  GetCount(item: UserInfo): number {
    let count = 0;
    item.Items.forEach(borrow => {
      count += borrow.Count;
    });
    
    return count;
  }

  ngOnInit() { 
    this.DL.TITLE = "Borrow List";
  }
}
