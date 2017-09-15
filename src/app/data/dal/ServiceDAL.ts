import { DataLayer } from './../data.layer';
import { ServiceInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class ServiceDAL {
    PATH: string = "/services";
    constructor(private DL: DataLayer, private af: AngularFireDatabase) {}

    public Load() {
        this.af.list(this.PATH, { query: { orderByChild: 'Name' } }).first().subscribe(snapshots => {
            this.DL.Services = new Array<ServiceInfo>();
            snapshots.forEach(snapshot => {
                let info: ServiceInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Services.push(info);
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