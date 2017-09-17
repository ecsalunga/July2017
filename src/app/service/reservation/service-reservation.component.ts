import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ReservationInfo } from '../../data/models';

@Component({
  selector: 'service-reservation',
  templateUrl: './service-reservation.component.html',
  styleUrls: ['./service-reservation.component.css']
})
export class ServiceReservationComponent implements OnInit {
  constructor(private core: Core, public DL: DataLayer, private DA: DataAccess) { }
  
  GetDate(keyDay: number): Date {
    return this.core.numberToDate(keyDay);
  }

  Select(item: ReservationInfo, index: number) {
    this.DL.ServiceReservationTabIndex = index;
    this.DL.ServiceReservation =  item;
    //this.DL.LoadFromLink('service-reservation-detail');
  }

  HasClean(): boolean {
    let hasClean = false
    this.DL.ServiceReservationDone.forEach(item => {
      if(item.Status == this.DL.STATUS_DONE)
        hasClean = true;
    });

    return hasClean;
  }

  CleanDelete() {
    this.DL.ServiceReservationDone.forEach(item => {
      if(item.Status == this.DL.STATUS_DONE)
        this.DA.ServiceReserveDelete(item);
    });

    this.DL.Display("Reservation", "Done Status Cleared!");
  }

  ngOnInit() {
    this.DL.TITLE = "Reservation List";
  }
}
