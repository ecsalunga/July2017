import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ReservationInfo } from '../../data/models';

@Component({
  selector: 'service-reservation-detail',
  templateUrl: './service-reservation-detail.component.html',
  styleUrls: ['./service-reservation-detail.component.css']
})
export class ServiceReservationDetailComponent implements OnInit {
  model: ReservationInfo;
  selectedStatus: string;

  constructor(private core: Core, public DL: DataLayer, private DA: DataAccess) { 
    this.model = Object.assign({}, this.DL.ServiceReservation);
    this.selectedStatus = this.model.Status;
  }

  CanSave(): boolean {
    return (this.DL.UserAccess.ServiceReservationEdit && 
      !(this.model.Status == this.DL.STATUS_DONE));
  }

  Save() {
    if(this.DL.ServiceReservation.Status != this.selectedStatus) {
      this.DL.ReservationUpdateStatus(this.model, this.selectedStatus);
      this.DA.ServiceReserveSave(this.model);
      this.DL.Display("Reservation", "Saved!");
    }
    this.LoadList();
  }
  
  GetDate(keyDay: number): Date {
    return this.core.numberToDate(keyDay);
  }

  GetDay(keyDay: number): Date {
    return this.core.numberToDate(parseInt(keyDay + '000000'))
  }

  LoadList() {
    this.DL.LoadFromLink("service-reservation");
  }

  BackToPublic() {
    this.DL.LoadFromLink("service-reserve");
  }

  ngOnInit() {
    this.DL.TITLE = "Reservation Details";
  }
}
