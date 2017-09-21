import { Core } from './../../core';
import { DataLayer } from './../data.layer';
import { ShowcaseInfo, OrderInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class ShowcaseDAL {
    PATH: string = "/showcases/items";
    PATH_ORDER: string = "/showcases/orders";

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
            
            this.DL.ShowCaseTodayCount = this.DL.ShowcaseToday.length;
        });
    }

    public LoadOrder() {
        this.af.list(this.PATH_ORDER, { query: { orderByChild: 'ActionDate' } }).subscribe(snapshots => {
            this.DL.ShowcaseOrders = new Array<OrderInfo>();
            this.DL.ShowcaseUserDoneOrders = new Array<OrderInfo>();
            this.DL.ShowcaseUserSelectingOrders = new Array<OrderInfo>();
            this.DL.ShowcaseUserOrders = new Array<OrderInfo>();
            this.DL.ShowcaseUserHasOrder = false;
            this.DL.ShowcaseUserHasOpenCart = false;

            snapshots.forEach(snapshot => {
                let info: OrderInfo = snapshot;
                info.key = snapshot.$key;

                if(info.Status == this.DL.STATUS_SELECTING)
                    this.DL.ShowcaseUserSelectingOrders.push(info);
                else if(info.Status == this.DL.STATUS_CANCELLED || info.Status == this.DL.STATUS_DELIVERED || info.Status == this.DL.STATUS_DONE)
                    this.DL.ShowcaseUserDoneOrders.push(info);
                else
                    this.DL.ShowcaseOrders.push(info);

                if(info.Status != this.DL.STATUS_DONE && info.MemberKey == this.DL.User.key) {
                    this.DL.ShowcaseUserOrders.push(info);
                    this.DL.ShowcaseUserHasOrder = true;
                    if(info.Status == this.DL.STATUS_SELECTING)
                        this.DL.ShowcaseUserHasOpenCart = true;
                }
            });

            this.DL.ShowcaseUserOrders.reverse();
            this.DL.ShowcaseUserDoneOrders.reverse();
            this.DL.ShowcaseUserSelectingOrders.reverse();
        });
    }

    public SaveOrder(item: OrderInfo) {
        if (item.key)
            this.af.list(this.PATH_ORDER).update(item.key, item);
        else
            this.af.list(this.PATH_ORDER).push(item);
    }

    public DeleteOrder(item: OrderInfo) {
        this.af.list(this.PATH_ORDER).remove(item.key);
    }

    public Save(item: ShowcaseInfo) {
        if (item.key)
            this.af.list(this.PATH).update(item.key, item);
        else
            this.af.list(this.PATH).push(item);
    }
}