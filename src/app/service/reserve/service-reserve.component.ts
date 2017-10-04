import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ServiceInfo, ReservationInfo, UserInfo } from '../../data/models';

@Component({
  selector: 'service-reserve',
  templateUrl: './service-reserve.component.html',
  styleUrls: ['./service-reserve.component.css']
})
export class ServiceReserveComponent implements OnInit {
  FromDate: Date;
  ToDate: Date;
  ToDay: Date;
  fromHour: number = 8;
  toHour: number = 9;
  model: ServiceInfo;
  isReserving: boolean = false;
  selectedMember: UserInfo;
  note: string = "";

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    this.model = Object.assign({}, this.DL.Service);
    this.ToDay = new Date();
    this.FromDate = this.ToDay;
    this.ToDate = new Date();
    this.ToDate.setDate(this.ToDate.getDate() + 1);
    this.DL.Members.forEach(member => {
      if(this.DL.User.key == member.key) {
        this.selectedMember = member;
      }
    });
  }

  ShowReserve() {
    this.isReserving = true;
  }

  HideReserve() {
    this.isReserving = false;
    this.note = "";
  }

  Reserve() {
    let info = new ReservationInfo();
    info.MemberKey = this.selectedMember.key;
    info.MemberName = this.selectedMember.Name;
    info.ItemKey = this.model.key;
    info.Name = this.model.Name;
    info.Note = this.note;
    info.Price = this.model.Price;
    info.Count = this.getCount();
    info.BookingType = this.model.BookingType;

    this.DL.StatusUpdate(info, this.DL.STATUS_REQUESTED);
    info.From = this.core.dateToKeyDay(this.FromDate);

    if(info.BookingType == this.DL.BOOKING_TYPE_DAY)
      info.To = this.core.dateToKeyDay(this.ToDate);
    else {
      info.FromHour = this.fromHour;
      info.To = this.toHour;
    }

    this.DA.ServiceReserveSave(info);
    this.DL.Display("Reservation", "Submitted!");
    if(this.selectedMember.key == this.DL.User.key)
      this.DL.LoadFromLink("service-booking");
    else
      this.LoadList();
  }

  GetSchedule(): string {
    return this.DL.GetHourSchedule(this.fromHour, this.toHour);
  }

  getCount(): number {
    if(this.model.BookingType == this.DL.BOOKING_TYPE_DAY) {
      let timeDiff = Math.abs(this.FromDate.getTime() - this.ToDate.getTime());
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
      return diffDays;
    }
    else
      return this.toHour - this.fromHour;
  }

  CanAdd(): boolean {
    if(!this.FromDate || !this.ToDate)
      return false;
    
    if(this.DL.KeyDay > this.core.dateToKeyDay(this.FromDate) || !this.selectedMember)
      return false;

    if(this.model.BookingType == this.DL.BOOKING_TYPE_DAY) {
      return (this.core.dateToKeyDay(this.ToDate) > this.core.dateToKeyDay(this.FromDate) 
      && this.core.dateToKeyDay(this.ToDate) >= this.core.dateToKeyDay(this.ToDay));
    }
    else {
      if(!this.fromHour || !this.toHour)
        return false;

      return (this.toHour > this.fromHour);
    }
  }

  LoadList() {
    this.DL.LoadFromLink("website-reservation");
  }

  ngOnInit() {
    this.DL.TITLE = "Reservation Request";
  }
}
