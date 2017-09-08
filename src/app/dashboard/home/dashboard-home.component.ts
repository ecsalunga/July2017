import { Component, OnInit } from '@angular/core';
import { DataLayer, DataAccess } from '../../data';

@Component({
  selector: 'dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {

  constructor(private DL: DataLayer, private DA: DataAccess) {}
  
  login() {
    this.DL.LoadFromLink('user-login');
  }

  ngOnInit() {
    this.DL.TITLE = "Welcome!";
    this.DL.LoadComponentsFromLink(['showcase-widget']);
  }
}
