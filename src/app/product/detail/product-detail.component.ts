import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ProductInfo } from '../../data/models';

@Component({
  selector: 'product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  model: ProductInfo;
  hasDuplicate: boolean;

  codeValidator = new FormControl('', [Validators.required]);
  descriptionValidator = new FormControl('', [Validators.required]);
  priceValidator = new FormControl('', [Validators.required]);

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    if (this.DL.Product)
      this.model = Object.assign({}, this.DL.Product);
    else
      this.model = new ProductInfo();
  }

  CanSave(): boolean {
    if(this.descriptionValidator.invalid || this.descriptionValidator.invalid || this.priceValidator.invalid)
      return false;
    
    if(this.model.Code == this.DL.KEYDISCOUNT || this.model.Code == this.DL.KEYSUBSCRIPTION)
      return false;

    if(this.model.key && !this.DL.UserAccess.ProductEdit)
      return false;

    if(!this.model.key && !this.DL.UserAccess.ProductAdd)
      return false;

    if(this.model.Quantity > 5000)
      return false;

    return true;
  }

  CodeChange() {
    this.hasDuplicate = false;
  }

  Save() {
    let validated = this.hasDuplicate;
    this.hasDuplicate = false;

    if(!validated) {
      this.DL.Products.forEach(product => {
        if(this.model.Code == product.Code && this.model.key != product.key) {
          this.hasDuplicate = true;
        }
      });

      if(!this.hasDuplicate)
        validated = true;
      else
        this.DL.DisplayLong("Duplicate Code", "Save again to proceed.");
    }

    if(validated) {
      this.DA.ProductSave(this.model);

      // update showcase
      this.DL.Showcases.forEach(item => {
        if(this.model.Code == item.ProductCode) {
          if(this.model.Description != item.ProductName || this.model.Price != item.ProductPrice) {
            item.ProductName = this.model.Description;
            item.ProductPrice = this.model.Price;
            this.DA.ShowcaseSave(item);
          }
        }
      });
      
      this.LoadList();
      this.DL.Display("Product Details", "Saved!");
    }
  }

  LoadList() {
    this.DL.LoadFromLink("product-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Product Details";
  }
}
