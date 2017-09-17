import { Component, OnInit } from '@angular/core';
import { DataLayer, DataAccess } from '../../data';

@Component({
  selector: 'website-home',
  templateUrl: './website-home.component.html',
  styleUrls: ['./website-home.component.css']
})
export class WebsiteHomeComponent implements OnInit {
  constructor(public DL: DataLayer, private DA: DataAccess) {}
  
  ngOnInit() {
    this.DL.TITLE = this.DL.ModuleSetting.HomeTitle;
  }
}
