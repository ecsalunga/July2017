import { Component, OnInit } from '@angular/core';
import { DataAccess, DataLayer } from '../../data';
import { GalleryInfo } from '../../data/models';

@Component({
  selector: 'gallery-detail',
  templateUrl: './gallery-detail.component.html',
  styleUrls: ['./gallery-detail.component.css']
})
export class GalleryDetailComponent implements OnInit {
  model: GalleryInfo;
  isLoaded: boolean = true;

  constructor(private DA: DataAccess, public DL: DataLayer) {
    if (this.DL.Gallery)
      this.model = Object.assign({}, this.DL.Gallery);
    else
      this.model = new GalleryInfo(this.DL.DefaultImageURL);
  }

  SelectFile() {
    this.DL.SelectImage("images/gallery/");
  }

  ImageLoaded() {
    this.isLoaded = true;
  }

  CanSave(): boolean {
    if(!this.model.Name)
      return false;

    if(this.model.key && !this.DL.UserAccess.GalleryEdit)
      return false;

    if(!this.model.key && !this.DL.UserAccess.GalleryAdd)
      return false;

    return true;
  }

  Save() {
    this.DA.GallerySave(this.model);
    this.LoadList();
    this.DL.Display("Gallery Details", "Saved!");
  }

  LoadList() {
    this.DL.LoadFromLink("gallery-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Gallery Details";
    
    this.DA.ImageUploaded.subscribe(url => {
      this.model.ImageURL = url;
    });
    this.DA.DataChecked.subscribe(isValid => {
      if(isValid) 
        this.isLoaded = false;
    });
  }
}
