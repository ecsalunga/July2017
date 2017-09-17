import { Component, OnInit} from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ShowcaseInfo, ProductInfo } from '../../data/models';

@Component({
  selector: 'showcase-detail',
  templateUrl: './showcase-detail.component.html',
  styleUrls: ['./showcase-detail.component.css']
})
export class ShowcaseDetailComponent implements OnInit {
  model: ShowcaseInfo;
  isLoaded: boolean = true; 

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    if (this.DL.Showcase) {
      this.model = Object.assign({}, this.DL.Showcase);
      if(this.model.Product) {
        this.DL.Products.forEach(product => {
          if(this.model.Product.key == product.key) 
            this.model.Product = product;
        });
      }
    }
    else
      this.model = new ShowcaseInfo(this.DL.DefaultImageURL);
  }

  IsSaveDisabled() : boolean {
    return !this.model.Product || (!this.DL.UserAccess.ShowcaseEdit && !(!this.model.key)) || (!this.DL.UserAccess.ShowcaseAdd && !this.model.key);
  }

  SelectFile() {
    this.DL.SelectImage("images/showscase/");
  }

  Save() {
    this.DA.ShowcaseSave(this.model);
    this.LoadList();
    this.DL.Display("Showcase Details", "Saved!");
  }

  ImageLoaded() {
    this.isLoaded = true;
  }

  LoadList() {
    this.DL.LoadFromLink("showcase-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Showcase Details";
    
    this.DA.ImageUploaded.subscribe(url => {
      this.model.ImageURL = url;
    });
    this.DA.DataChecked.subscribe(isValid => {
      if(isValid) 
        this.isLoaded = false;
    });
  }
}
