import { Core } from './../../core';
import { DataLayer } from './../data.layer';
import { ServiceInfo, SubscriptionInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class SubscriptionDAL {
    PATH: string = "/subscriptions/items";
    constructor(private core: Core, private DL: DataLayer, private af: AngularFireDatabase) {}

    public Load() {
        this.af.list(this.PATH, { query: { orderByChild: 'Name' }}).first().subscribe(snapshots => {
            this.DL.Subscriptions = new Array<SubscriptionInfo>();

            snapshots.forEach(snapshot => {
                let info: SubscriptionInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Subscriptions.push(info);
            });
        });
    }

    public Save(item: SubscriptionInfo) {
        if (item.key)
            this.af.list(this.PATH).update(item.key, item);
        else
            this.af.list(this.PATH).push(item);
    }
}