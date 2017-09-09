import { DataLayer } from './../data.layer';
import { ModuleSettingInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class SettingDAL {
    PATH_MODULE: string = "/settings/module";
    constructor(private DL: DataLayer, private af: AngularFireDatabase) { }

    public ModuleLoad() {
        this.af.object(this.PATH_MODULE).first().subscribe(snapshot => {
            if (snapshot.$exists())
                this.DL.ModuleSetting = snapshot;
        });
    }

    public ModuleSave(item: ModuleSettingInfo) {
        this.af.object(this.PATH_MODULE).update(item);
        this.DL.ModuleSetting = item;
    }
}