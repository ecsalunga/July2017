import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ReservationInfo } from '../../data/models';

@Component({
  selector: 'service-booking',
  templateUrl: './service-booking.component.html',
  styleUrls: ['./service-booking.component.css']
})
export class ServiceBookingComponent implements OnInit {
  constructor(private core: Core, public DL: DataLayer, private DA: DataAccess) { }
  
  GetDate(keyDay: number): Date {
    return this.core.numberToDate(keyDay);
  }

  GetDay(keyDay: number): Date {
    return this.core.keyDayToDate(keyDay);
  }

  GetSchedule(booking: ReservationInfo): string {
    return this.DL.GetHourSchedule(booking.FromHour, booking.To);
  }

  IsDoneVisible(booking: ReservationInfo): boolean {
    return (booking.Status == this.DL.STATUS_REJECTED
      || booking.Status == this.DL.STATUS_CHECKOUT);
  }

  SetStatusDone(item: ReservationInfo) {
    if(item.Status == this.DL.STATUS_REJECTED)
      item.IsTransaction = true;

    this.DL.StatusUpdate(item, this.DL.STATUS_DONE);
    this.DA.ServiceReserveSave(item);
    this.DL.DisplayPublic("Reservation", "Hidden!");
    if(!this.DL.ServiceReservationUserHasItem) {
      this.LoadList();
    }
  }

  ViewStatus(item: ReservationInfo) {
    this.DL.ServiceReservation = item;
    this.DL.LoadFromPublic('service-reservation-detail');
  }

  LoadList() {
    this.DL.LoadFromLink("website-reservation");
  }

  ngOnInit() {
    this.DL.TITLE = "Bookings";
  }
}
