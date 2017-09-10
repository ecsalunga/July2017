import { DataLayer } from './../data.layer';
import { ModuleSettingInfo, SystemSettingInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class SettingDAL {
    PATH_MODULE: string = "/settings/module";
    PATH_SYSTEM: string = "/settings/system";

    constructor(private DL: DataLayer, private af: AngularFireDatabase) { }

    public ModuleLoad() {
        this.af.object(this.PATH_MODULE).first().subscribe(snapshot => {
            if (snapshot.$exists())
                this.DL.ModuleSetting = snapshot;
        });
    }

    public SystemLoad() {
        this.af.object(this.PATH_SYSTEM).first().subscribe(snapshot => {
            if (snapshot.$exists()) {
                this.DL.SystemSetting = snapshot;
                this.DL.SetSystemConfig();
            }
        });
    }

    public ModuleSave(item: ModuleSettingInfo) {
        this.af.object(this.PATH_MODULE).update(item);
        this.ModuleLoad();
    }

    public SystemSave(item: SystemSettingInfo) {
        this.af.object(this.PATH_SYSTEM).update(item);
        this.SystemLoad();
    }
}