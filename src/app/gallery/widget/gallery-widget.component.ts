import { Component, OnInit} from '@angular/core';
import { DataLayer, DataAccess } from '../../data';
import { GalleryInfo } from '../../data/models';

@Component({
  selector: 'gallery-widget',
  templateUrl: './gallery-widget.component.html',
  styleUrls: ['./gallery-widget.component.css']
})
export class GalleryWidgetComponent implements OnInit {

  constructor(public DL: DataLayer, private DA: DataAccess) {}
  
  View(item: GalleryInfo) {
    this.DA.LoadGallery(item);
  }

  ngOnInit() {
    
  }
}
