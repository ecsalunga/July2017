import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer } from '../../data';
import { GalleryInfo } from '../../data/models';

@Component({
  selector: 'gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css']
})
export class GalleryListComponent implements OnInit {

  constructor(private core: Core, public DL: DataLayer) {}
  
  Active(item: GalleryInfo): string {
    return item.IsActive ? "Yes" : "No";
  }

  SelectItem(item: GalleryInfo) {
    this.DL.Gallery = item;
    this.DL.LoadFromLink("gallery-detail");
  }

  SelectPhoto(item: GalleryInfo) {
    this.DL.Gallery = item;
    this.DL.LoadFromLink("gallery-photo-list");
  }

  AddItem(){
    this.DL.Gallery = null;
    this.DL.LoadFromLink("gallery-detail");
  }

  ngOnInit() { 
    this.DL.TITLE = "Gallery List";
  }
}
