import { Component, OnInit } from '@angular/core';
import { DataLayer, DataAccess } from '../../data';

@Component({
  selector: 'dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {

  constructor(public DL: DataLayer, private DA: DataAccess) {}
  
  Login() {
    this.DL.LoadFromLink('user-login');
  }

  ngOnInit() {
    this.DL.TITLE = this.DL.SystemSetting.HomeTitle;
    this.DL.LoadComponentsFromLink(['showcase-widget']);
  }
}
