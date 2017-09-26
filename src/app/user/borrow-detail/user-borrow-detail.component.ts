import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ProductInfo, UserInfo, BorrowInfo, Name2Value } from '../../data/models';

@Component({
  selector: 'user-borrow-detail',
  templateUrl: './user-borrow-detail.component.html',
  styleUrls: ['./user-borrow-detail.component.css']
})
export class UserBorrowDetailComponent implements OnInit {
  selectedProduct: ProductInfo;
  returnDate: Date = new Date();
  selectedQuantity: number = 1;
  quantities: Array<number>;
  selectedMember: UserInfo;
  borrowInfos: Array<BorrowInfo>;
  isNew: boolean = true;
  contactInfo: Name2Value;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    this.borrowInfos = new Array<BorrowInfo>();
    if(this.DL.UserSelected != null) {
      this.DL.UserAll.forEach(user => {
        if(this.DL.UserSelected.key == user.key) {
          this.selectedMember = user;
          this.isNew = false;
          this.contactInfo = this.DL.UserGetContactInfo(user.key);
          user.Borrows.forEach(borrow => {
            this.borrowInfos.push(borrow);
          });
        }
      });
    }
  }

  CanAdd(): boolean {
    if(!this.CanSave())
      return false;
    
    if(!this.selectedMember || !this.selectedProduct || !this.returnDate || this.selectedQuantity <= 0)
      return false;

    return true;
  }

  CanSave(): boolean {
    if(this.isNew && !this.DL.UserAccess.BorrowAdd)
    return false;
  
    if(!this.isNew && !this.DL.UserAccess.BorrowEdit)
      return false;

    return true;
  }

  GetDate(dateNumber: number): Date {
    return this.core.numberToDate(dateNumber);
  }

  GetDay(keyDay: number): Date {
    return this.core.keyDayToDate(keyDay);
  }

  AddItem() {
    let info = new BorrowInfo();
    info.ActionDate = this.DL.GetActionDate();
    info.BorrowType = this.DL.BORROW_PRODUCT;
    info.Code = this.selectedProduct.Code;
    info.Name = this.selectedProduct.Description;
    info.Count = this.selectedQuantity;
    info.ReturnDate = this.core.dateToKeyDay(this.returnDate);
    this.borrowInfos.push(info);
    this.borrowInfos.sort((item1, item2) => item1.ReturnDate - item2.ReturnDate);
    this.ClearSelection();
  }

  Delete(item: BorrowInfo) {
    this.borrowInfos = this.borrowInfos.filter(b => !(b.ActionDate == item.ActionDate && b.Code == item.Code));
  }

  IsDue(item: BorrowInfo): boolean {
    return (item.ReturnDate <= this.DL.KeyDay)
  }

  ClearSelection() {
    this.selectedProduct = null;
    this.quantities = new Array<number>();
    this.selectedQuantity = 1;
    this.returnDate = new Date();
  }

  Save() {
    this.selectedMember.Borrows = this.borrowInfos;
    this.DA.UserSave(this.selectedMember);
    this.DL.Display("Borrow", "Saved!");
    this.LoadList();
  }

  UserSelected() {
    this.borrowInfos = new Array<BorrowInfo>();
    if(this.selectedMember.Borrows != null && this.selectedMember.Borrows.length > 0) {
      this.selectedMember.Borrows.forEach(borrow => {
        this.borrowInfos.push(borrow);
      });
    }

    this.contactInfo = this.DL.UserGetContactInfo(this.selectedMember.key);
  }

  ProductSelected() {
    this.quantities = new Array<number>();
    for(let x = 1; x <= this.selectedProduct.Quantity; x++)
      this.quantities.push(x);
  }

  LoadList() {
    this.DL.LoadFromLink("user-borrow");
  }

  ngOnInit() {
    this.DL.TITLE = "Member Borrow";
  }
}
