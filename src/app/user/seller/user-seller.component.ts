import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer } from '../../data';
import { UserInfo } from '../../data/models';

@Component({
  selector: 'user-seller',
  templateUrl: './user-seller.component.html',
  styleUrls: ['./user-seller.component.css']
})
export class UserSellerComponent implements OnInit {
  constructor(private core: Core, public DL: DataLayer) {}
  
  SelectItem(user: UserInfo) {
    this.DL.UserSelected = user;
    this.DL.LoadFromLink("product-sell");
  }

  GetTotal(item: UserInfo): number {
    let total = 0;
    item.Sells.forEach(borrow => {
      total += borrow.Total;
    });
    
    return total;
  }

  GetCount(item: UserInfo): number {
    let count = 0;
    item.Sells.forEach(borrow => {
      count += borrow.Quantity;
    });
    
    return count;
  }

  HasDelete(item: UserInfo) {
    let hasDelete = false;
    item.Sells.forEach(sell => {
      if(sell.ForDelete)
        hasDelete = true;
    });
    return hasDelete;
  }

  ngOnInit() { 
    this.DL.TITLE = "Seller List";
  }
}