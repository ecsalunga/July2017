import { Component, OnInit } from '@angular/core';
import { DataLayer } from '../../data';
import { GalleryPhotoInfo } from '../../data/models';

@Component({
  selector: 'gallery-photo-list',
  templateUrl: './gallery-photo-list.component.html',
  styleUrls: ['./gallery-photo-list.component.css']
})
export class GalleryPhotoListComponent implements OnInit {

  constructor(public DL: DataLayer) {
    this.DL.SetGalleryPhotos(this.DL.Gallery);
  }
  
  Active(item: GalleryPhotoInfo): string {
    return item.IsActive ? "Yes" : "No";
  }

  SelectItem(item: GalleryPhotoInfo) {
    this.DL.GalleryPhoto = item;
    this.DL.LoadFromLink("gallery-photo-detail");
  }

  AddItem(){
    this.DL.GalleryPhoto = null;
    this.DL.LoadFromLink("gallery-photo-detail");
  }

  LoadList() {
    this.DL.LoadFromLink("gallery-list");
  }

  ngOnInit() { 
    this.DL.TITLE = "Gallery Photo List";
  }
}
