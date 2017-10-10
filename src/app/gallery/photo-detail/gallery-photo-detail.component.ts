import { Component, OnInit } from '@angular/core';
import { DataAccess, DataLayer } from '../../data';
import { GalleryPhotoInfo } from '../../data/models';

@Component({
  selector: 'gallery-photo-detail',
  templateUrl: './gallery-photo-detail.component.html',
  styleUrls: ['./gallery-photo-detail.component.css']
})
export class GalleryPhotoDetailComponent implements OnInit {
  model: GalleryPhotoInfo;
  isLoaded: boolean = true;
  
  constructor(private DA: DataAccess, public DL: DataLayer) {
    if (this.DL.GalleryPhoto)
      this.model = Object.assign({}, this.DL.GalleryPhoto);
    else
      this.model = new GalleryPhotoInfo(this.DL.DefaultImageURL);
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

    if(this.model.key && !this.DL.UserAccess.GalleryPhotoEdit)
      return false;

    if(!this.model.key && !this.DL.UserAccess.GalleryPhotoAdd)
      return false;

    return true;
  }

  Save() {
    this.model.GalleryKey = this.DL.Gallery.key;
    this.DA.GalleryPhotoSave(this.model);
    this.LoadList();
    this.DL.Display("Photo Details", "Saved!");
  }

  LoadList() {
    this.DL.LoadFromLink("gallery-photo-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Photo Details";

    this.DA.ImageUploaded.subscribe(url => {
      this.model.ImageURL = url;
    });
    this.DA.DataChecked.subscribe(isValid => {
      if(isValid) 
        this.isLoaded = false;
    });
  }
}
