import { Component, OnInit } from '@angular/core';
import { DataLayer } from '../../data';

@Component({
  selector: 'website-gallery',
  templateUrl: './website-gallery.component.html',
  styleUrls: ['./website-gallery.component.css']
})
export class WebsiteGalleryComponent implements OnInit {
  constructor(public DL: DataLayer) {}
  
  ngOnInit() {
    this.DL.TITLE = "Photo Gallery";
    this.DL.LoadComponentsFromLink(['gallery-widget']);
  }
}