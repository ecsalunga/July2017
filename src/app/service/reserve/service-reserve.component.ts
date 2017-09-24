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
  model: ServiceInfo;
  isReserving: boolean = false;
  selectedMember: UserInfo;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    this.model = Object.assign({}, this.DL.Service);
    this.ToDay = new Date();
    this.FromDate = this.ToDay;
    this.ToDate = this.ToDay;

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
  }

  Reserve() {
    let info = new ReservationInfo();
    info.MemberKey = this.selectedMember.key;
    info.MemberName = this.selectedMember.Name;
    info.ItemKey = this.model.key;
    info.Name = this.model.Name;
    info.Price = this.model.Price;
    info.Count = this.GetDayCount();

    this.DL.StatusUpdate(info, this.DL.STATUS_REQUESTED);
    info.From = this.core.dateToKeyDay(this.FromDate);
    info.To = this.core.dateToKeyDay(this.ToDate);

    this.DA.ServiceReserveSave(info);
    this.DL.Display("Reservation", "Submitted!");
    if(this.selectedMember.key == this.DL.User.key)
      this.DL.LoadFromLink("service-booking");
    else
      this.LoadList();
  }

  GetDayCount(): number {
    let timeDiff = Math.abs(this.FromDate.getTime() - this.ToDate.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    return diffDays + 1;
  }

  CanAdd(): boolean {
    if(this.DL.KeyDay > this.core.dateToKeyDay(this.FromDate) || !this.selectedMember)
      return false;

    return (this.core.dateToKeyDay(this.ToDate) >= this.core.dateToKeyDay(this.FromDate) 
      && this.core.dateToKeyDay(this.ToDate) >= this.core.dateToKeyDay(this.ToDay));
  }

  LoadList() {
    this.DL.LoadFromLink("website-reservation");
  }

  ngOnInit() {
    this.DL.TITLE = "Reservation Request";
  }
}
