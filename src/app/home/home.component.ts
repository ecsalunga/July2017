import { Component, OnInit } from '@angular/core';
import { DataLayer } from '../data';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private DL: DataLayer) {}

  ngOnInit() {
    this.DL.TITLE = "Welcome!";
  }
}
