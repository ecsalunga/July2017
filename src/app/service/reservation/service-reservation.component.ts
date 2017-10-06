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
  constructor(private core: Core, public DL: DataLayer, private DA: DataAccess) {
    if(this.DL.SOURCE == this.DL.MENU)
      this.DL.ServiceReservationTabIndex = 0;
  }
  
  GetDate(keyDay: number): Date {
    return this.core.numberToDate(keyDay);
  }

  Select(item: ReservationInfo, index: number) {
    this.DL.ServiceReservationTabIndex = index;
    this.DL.ServiceReservation =  item;
    this.DL.LoadFromLink('service-reservation-detail');
  }

  IsDue(item: ReservationInfo) {
    return (item.From <= this.DL.KeyDay && item.Status != this.DL.STATUS_CHECKEDIN);
  }

  HasClean(): boolean {
    let hasClean = false
    this.DL.ServiceReservationDone.forEach(item => {
      if((item.IsTransaction && item.Status == this.DL.STATUS_DONE) || item.Status == this.DL.STATUS_CANCELLED)
        hasClean = true;
    });

    return hasClean;
  }

  LoadUser(item: ReservationInfo) {
    this.DA.ShowUserInfo(item.MemberKey);
  }

  Visible(item: ReservationInfo): boolean {
    let view = true;
    if(!this.DL.UserAccess.ServiceReservationDoneView && ((item.Status == this.DL.STATUS_DONE && item.IsTransaction) || item.Status == this.DL.STATUS_CANCELLED))
      view = false;

    return view;
  }

  CleanDelete() {
    this.DL.ServiceReservationDone.forEach(item => {
      if((item.IsTransaction && item.Status == this.DL.STATUS_DONE) || item.Status == this.DL.STATUS_CANCELLED)
        this.DA.ServiceReserveDelete(item);
    });

    this.DL.Display("Reservation", "Done Status Cleared!");
  }

  ngOnInit() {
    this.DL.TITLE = "Reservation List";
  }
}
