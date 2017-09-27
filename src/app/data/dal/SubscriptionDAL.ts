import { Core } from './../../core';
import { DataLayer } from './../data.layer';
import { ServiceInfo, SubscriptionInfo, QuotaInfo, TransactionInfo, PurchaseInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class SubscriptionDAL {
    PATH: string = "/subscriptions/items";
    PATH_QUOTA: string = "/subscriptions/quotas";
    PATH_TRANS: string = "/transactions/items";
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

    GenerateQuota(quota: QuotaInfo, keyDay: number) {
        this.af.list(this.PATH_TRANS, { query: { orderByChild: this.DL.KEYDAY, equalTo: keyDay }}).first().subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                let info: TransactionInfo = snapshot;
                
                if(quota.Subscribers.some(mem => info.MemberKey == mem.Value1))
                {
                    let purchase: PurchaseInfo = null;

                    if(!quota.Purchases.some(pur => info.MemberKey == pur.MemberKey)) {
                        purchase = new PurchaseInfo();
                        purchase.MemberKey = info.MemberKey;
                        purchase.MemberName = info.BuyerName;
                        quota.Purchases.push(purchase);
                    }
                    else
                        purchase = quota.Purchases.find(pur => pur.MemberKey == info.MemberKey);

                    // [pending] Append purchases here
                }
            });

            if(quota.To == keyDay)
                this.SaveQuota(quota);
            else
                this.GenerateQuota(quota, keyDay++);
        });
    }

    public LoadQuota() {
        this.af.list(this.PATH_QUOTA, { query: { orderByChild: 'ActionDate' }}).first().subscribe(snapshots => {
            this.DL.SubscriptionQuotas = new Array<QuotaInfo>();

            snapshots.forEach(snapshot => {
                let info: QuotaInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.SubscriptionQuotas.push(info);
            });
        });
    }

    public Save(item: SubscriptionInfo) {
        if (item.key)
            this.af.list(this.PATH).update(item.key, item);
        else
            this.af.list(this.PATH).push(item);
    }

    public SaveQuota(item: QuotaInfo) {
        if (item.key)
            this.af.list(this.PATH_QUOTA).update(item.key, item);
        else
            this.af.list(this.PATH_QUOTA).push(item);
    }
}