import { Component, OnInit } from '@angular/core';
import { DataLayer, DataAccess } from '../../data';

@Component({
  selector: 'website-catalog',
  templateUrl: './website-catalog.component.html',
  styleUrls: ['./website-catalog.component.css']
})
export class WebsiteCatalogComponent implements OnInit {
  constructor(public DL: DataLayer, private DA: DataAccess) {}
  
  ngOnInit() {
    this.DL.TITLE = "Product Catalog";
    this.DL.LoadComponentsFromLink(['showcase-widget']);
  }
}