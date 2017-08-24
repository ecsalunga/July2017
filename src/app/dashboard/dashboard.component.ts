import { Component, OnInit } from '@angular/core';
import { DataLayer } from '../data';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private DL: DataLayer) {}

  ngOnInit() {
    this.DL.TITLE = "Dashboard";
  }
}
