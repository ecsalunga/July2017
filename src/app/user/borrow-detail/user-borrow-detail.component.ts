import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ProductInfo, UserInfo, SellInfo } from '../../data/models';

@Component({
  selector: 'user-borrow-detail',
  templateUrl: './user-borrow-detail.component.html',
  styleUrls: ['./user-borrow-detail.component.css']
})
export class UserBorrowDetailComponent implements OnInit {
  model: ProductInfo;
  selectedQuantity: number = 1;
  quantities: Array<number>;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) { }

  Save() {

  }
  
  ClearSelection() {
    this.model = null;
    this.quantities = new Array<number>();
    this.selectedQuantity = 1;
  }

  ProductSelected() {
    this.quantities = new Array<number>();
    for(let x = 1; x <= this.model.Quantity; x++)
      this.quantities.push(x);
  }

  LoadList() {
    this.DL.LoadFromLink("user-borrow");
  }

  ngOnInit() {
    this.DL.TITLE = "Member Borrow";
  }
}
