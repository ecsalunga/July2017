import { Core } from './../../core';
import { DataLayer } from './../data.layer';
import { ServiceInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class ServiceDAL {
    PATH: string = "/services";
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
        });
    }

    public Save(item: ServiceInfo) {
        if (item.key)
            this.af.list(this.PATH).update(item.key, item);
        else
            this.af.list(this.PATH).push(item);
    }
}