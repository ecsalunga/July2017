import { Component, OnInit } from '@angular/core';
import { DataLayer, DataAccess } from '../../data';

@Component({
  selector: 'website-reservation',
  templateUrl: './website-reservation.component.html',
  styleUrls: ['./website-reservation.component.css']
})
export class WebsiteReservationComponent implements OnInit {
  constructor(public DL: DataLayer, private DA: DataAccess) {}
  
  ngOnInit() {
    this.DL.TITLE = "Reservation";
    this.DL.LoadComponentsFromLink(['service-widget']);
  }
}
