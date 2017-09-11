import { Component, OnInit, ViewChild, ViewContainerRef, Renderer } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ShowcaseInfo, ProductInfo } from '../../data/models';

@Component({
  selector: 'showcase-detail',
  templateUrl: './showcase-detail.component.html',
  styleUrls: ['./showcase-detail.component.css']
})
export class ShowcaseDetailComponent implements OnInit {
  @ViewChild('fileSelector', {read: ViewContainerRef })
  fileSelector: ViewContainerRef;
  model: ShowcaseInfo;
  isLoaded: boolean = true;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer, private renderer: Renderer) {
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

  selectFile() {
    this.fileSelector.element.nativeElement.click();
  }

  Save() {
    this.DA.ShowcaseSave(this.model);
    this.LoadList();
    this.DL.Display("Showcase Details", "Saved!");
  }

  Upload() {
    let selectedFile = (<HTMLInputElement>this.fileSelector.element.nativeElement).files[0];
    if(selectedFile.type.indexOf("image") > -1) {
      this.isLoaded = false;
      let fRef = this.DA.StorageRef.child("images/showscase/" + selectedFile.name);
      fRef.put(selectedFile).then(snapshot => {
          this.model.ImageURL = snapshot.downloadURL;
      });
    }
    else
      this.DL.Display("Image", "Please select valid image file.");
  }

  ImageLoaded() {
    this.isLoaded = true;
  }

  LoadList() {
    this.DL.LoadFromLink("showcase-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Showcase Details";

    this.renderer.listen(this.fileSelector.element.nativeElement, 'change', (event) => {
      this.Upload();
    });
  }
}
