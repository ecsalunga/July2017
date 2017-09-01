import { DataLayer } from './../data.layer';
import { MemberInfo } from './../../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class MemberDAL {
    PATH: string = "/members";
    constructor(private DL: DataLayer, private af: AngularFireDatabase) {}

    public Load() {
        this.af.list(this.PATH, { query: { orderByChild: 'Name' }}).first().subscribe(snapshots => {
            this.DL.Members = new Array<MemberInfo>();
            this.DL.MemberSelections = new Array<MemberInfo>();

            snapshots.forEach(snapshot => {
                let info: MemberInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Members.push(info);
            });

            // add walk-in
            this.DL.MemberSelections.push(this.DL.MemberWalkIn);
            this.DL.MemberSelections = this.DL.MemberSelections.concat(this.DL.Members);
        });
    }

    public Save(item: MemberInfo) {
        if (item.key)
            this.af.list(this.PATH).update(item.key, item);
        else
            this.af.list(this.PATH).push(item);
    }
}