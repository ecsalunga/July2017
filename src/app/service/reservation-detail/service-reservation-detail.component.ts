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
    return (this.DL.UserAccess.ServiceReservationEdit 
      && this.model.Status != this.DL.STATUS_DONE 
      && this.model.Status != this.DL.STATUS_CANCELLED);
  }

  CanDelete(): boolean {
    return (this.model.Status == this.DL.STATUS_CANCELLED || (this.model.Status == this.DL.STATUS_DONE && this.model.IsTransaction));
  }

  Save() {
    if(this.DL.ServiceReservation.Status != this.selectedStatus || this.DL.ServiceReservation.Note != this.model.Note) {
      if((this.model.Status == this.DL.STATUS_REJECTED 
        || this.model.Status == this.DL.STATUS_CANCELLED 
        || this.model.Status == this.DL.STATUS_NOSHOW) && this.selectedStatus == this.DL.STATUS_DONE)
        this.model.IsTransaction = true;

      this.DL.StatusUpdate(this.model, this.selectedStatus);
      this.DA.ServiceReserveSave(this.model);
      this.DL.Display("Reservation", "Saved!");
    }
    this.LoadList();
  }

  ShowGenerateTransaction(): boolean {
    return (!this.model.IsTransaction 
      && (this.model.Status == this.DL.STATUS_DONE || this.model.Status == this.DL.STATUS_CHECKOUT));
  }

  GenerateTransaction() {
    this.DA.ServiceReservationToTransaction(this.model);
    this.DL.StatusInject(this.model, this.DL.STATUS_SAVEDTO_TRANSACT);
    this.model.IsTransaction = true;
    this.DA.ServiceReserveSave(this.model);
    this.LoadList();
    this.DL.Display("Transaction", "Saved!");
  }

  Delete() {
    this.DA.ServiceReserveDelete(this.model);
    this.DL.Display("Reservation", "Deleted!");
    this.LoadList();
  }

  GetSchedule(): string {
    return this.DL.GetHourSchedule(this.model.FromHour, this.model.To);
  }
  
  GetDate(keyDay: number): Date {
    return this.core.numberToDate(keyDay);
  }

  GetDay(keyDay: number): Date {
    return this.core.keyDayToDate(keyDay);
  }

  LoadList() {
    this.DL.LoadFromLink("service-reservation");
  }

  BackToPublic() {
    this.DL.LoadFromLink("service-booking");
  }

  ngOnInit() {
    this.DL.TITLE = "Reservation Details";
  }
}
