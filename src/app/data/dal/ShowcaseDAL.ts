import { Core } from './../../core';
import { DataLayer } from './../data.layer';
import { ShowcaseInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class ShowcaseDAL {
    PATH: string = "/showcases";
    constructor(private core: Core, private DL: DataLayer, private af: AngularFireDatabase) {}

    public Load() {
        this.af.list(this.PATH, { query: { orderByChild: 'Order' } }).first().subscribe(snapshots => {
            this.DL.Showcases = new Array<ShowcaseInfo>();
            this.DL.ShowcaseToday = new Array<ShowcaseInfo>();

            snapshots.forEach(snapshot => {
                let info: ShowcaseInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Showcases.push(info);

                // get showcase for today
                let keyToday: number = this.core.dateToKeyDay(this.DL.Date);
                if (info.Schedules) {
                    let hasToday: boolean = false;
                    info.Schedules.forEach(item => {
                        if (item.From <= keyToday && item.To >= keyToday)
                            hasToday = true;
                    });

                    if (hasToday)
                        this.DL.ShowcaseToday.push(info);
                }
            });
        });
    }

    public Save(item: ShowcaseInfo) {
        if (item.key)
            this.af.list(this.PATH).update(item.key, item);
        else
            this.af.list(this.PATH).push(item);
    }
}