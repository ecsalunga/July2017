import { Component, OnInit } from '@angular/core';
import { DataLayer, DataAccess } from '../../data';
import { ServiceInfo } from '../../data/models';

@Component({
  selector: 'service-widget',
  templateUrl: './service-widget.component.html',
  styleUrls: ['./service-widget.component.css']
})
export class ServiceWidgetComponent implements OnInit {
 
  constructor(public DL: DataLayer, private DA: DataAccess) { }

  Book(item: ServiceInfo) {
    this.DL.Service = item;
    this.DL.LoadFromLink("service-reserve");
  }

  CanBook(): boolean {
    if(!this.DL.User.IsMember)
      return false;
    
    let openBooking = 0;
    this.DL.ServiceReservationUser.forEach(book => {
      if(book.Status == this.DL.STATUS_REQUESTED
        || book.Status == this.DL.STATUS_IN_PROGRESS
        || book.Status == this.DL.STATUS_CONFIRMED
      )
        openBooking++; 
    });

    return this.DL.ModuleSetting.ServiceReservationMax > openBooking;
  }

  ngOnInit() {
  }
}
