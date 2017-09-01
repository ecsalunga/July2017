import { DataLayer } from './../data.layer';
import { AccessInfo } from './../../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class AccessDAL {
    PATH: string = "/accesses";
    constructor(private DL: DataLayer, private af: AngularFireDatabase) {}

    public Load() {
        this.af.list(this.PATH, { query: { orderByChild: 'Name' } }).first().subscribe(snapshots => {
            this.DL.Accesses = new Array<AccessInfo>();
            snapshots.forEach(snapshot => {
                let info: AccessInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Accesses.push(info);
            });
        });
    }

    public Save(item: AccessInfo) {
        if (item.key)
            this.af.list(this.PATH).update(item.key, item);
        else
            this.af.list(this.PATH).push(item);
    }
}