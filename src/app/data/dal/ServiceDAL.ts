import { Core } from './../../core';
import { DataLayer } from './../data.layer';
import { ServiceInfo, ReservationInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class ServiceDAL {
    PATH: string = "/services/items";
    PATH_RESERVE: string = "/services/reservations";
    constructor(private core: Core, private DL: DataLayer, private af: AngularFireDatabase) {}

    public Load() {
        this.af.list(this.PATH, { query: { orderByChild: 'Order' }}).first().subscribe(snapshots => {
            this.DL.Services = new Array<ServiceInfo>();
            this.DL.ServiceToday = new Array<ServiceInfo>();

            snapshots.forEach(snapshot => {
                let info: ServiceInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Services.push(info);

                // get services for today
                let keyToday: number = this.core.dateToKeyDay(this.DL.Date);
                if (info.Schedules) {
                    let hasToday: boolean = false;
                    info.Schedules.forEach(item => {
                        if (item.From <= keyToday && item.To >= keyToday)
                            hasToday = true;
                    });

                    if (hasToday)
                        this.DL.ServiceToday.push(info);
                }
            });

            this.DL.ServiceTodayCount = this.DL.ServiceToday.length;
        });
    }

    public LoadReservation() {
        this.af.list(this.PATH_RESERVE, { query: { orderByChild: 'ActionDate' } }).subscribe(snapshots => {
            this.DL.ServiceReservationUser = new Array<ReservationInfo>();
            this.DL.ServiceReservationActive = new Array<ReservationInfo>();
            this.DL.ServiceReservationDone = new Array<ReservationInfo>();
            this.DL.ServiceReservationNew = new Array<ReservationInfo>();
            this.DL.ServiceReservationUserHasItem = false;

            snapshots.forEach(snapshot => {
                let info: ReservationInfo = snapshot;
                info.key = snapshot.$key;

                if(info.Status == this.DL.STATUS_REQUESTED)
                    this.DL.ServiceReservationNew.push(info);
                else if(info.Status == this.DL.STATUS_CONFIRMED 
                    || info.Status == this.DL.STATUS_CHECKEDIN)
                    this.DL.ServiceReservationActive.push(info);
                else
                    this.DL.ServiceReservationDone.push(info); 

                if(info.Status != this.DL.STATUS_DONE && info.MemberKey == this.DL.User.key) {
                    this.DL.ServiceReservationUser.push(info);
                    this.DL.ServiceReservationUserHasItem = true;
                }
            });

            // sort by event date from
            this.DL.ServiceReservationNew.sort((item1, item2) => item1.From - item2.From);
            this.DL.ServiceReservationActive.sort((item1, item2) => item1.From - item2.From);

            this.DL.ServiceReservationDone.reverse();
            this.DL.ServiceReservationUser.reverse();
        });
    }

    public SaveReservation(item: ReservationInfo) {
        if (item.key)
            this.af.list(this.PATH_RESERVE).update(item.key, item);
        else
            this.af.list(this.PATH_RESERVE).push(item);
    }

    public DeleteReservation(item: ReservationInfo) {
        this.af.list(this.PATH_RESERVE).remove(item.key);
    }

    public Save(item: ServiceInfo) {
        if (item.key)
            this.af.list(this.PATH).update(item.key, item);
        else
            this.af.list(this.PATH).push(item);
    }
}