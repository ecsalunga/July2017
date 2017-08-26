import { Component, OnInit } from '@angular/core';
import { DataLayer, DataAccess } from '../data';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private DL: DataLayer, private DA: DataAccess) {}

  ngOnInit() {
    this.DL.TITLE = "Welcome!";
    this.DL.LoadComponentsFromLink(['showcase-widget']);
  }
}
