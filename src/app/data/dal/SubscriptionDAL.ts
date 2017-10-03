import { Core } from './../../core';
import { DataLayer } from './../data.layer';
import { ServiceInfo, SubscriptionInfo, QuotaInfo, TransactionInfo, PurchaseInfo, Name2Value } from '../models';
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
            
            this.DL.SubscriptionQuotaSelection = new Array<SubscriptionInfo>();
            let subAll = new SubscriptionInfo(this.DL.DefaultImageURL);
            subAll.key = this.DL.KEYALLUSERS;
            subAll.Name = this.DL.KEYALLUSERS;
            this.DL.SubscriptionQuotaSelection.push(subAll);

            let subMembers = new SubscriptionInfo(this.DL.DefaultImageURL);
            subMembers.key = this.DL.KEYMEMBERS;
            subMembers.Name = this.DL.KEYMEMBERS;
            this.DL.SubscriptionQuotaSelection.push(subMembers);
            this.DL.SubscriptionQuotaSelection = this.DL.SubscriptionQuotaSelection.concat(this.DL.Subscriptions);
        });
    }

    GenerateQuota(quota: QuotaInfo, keyDay: number) {
        this.af.list(this.PATH_TRANS, { query: { orderByChild: this.DL.KEYDAY, equalTo: keyDay }}).first().subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                let info: TransactionInfo = snapshot;
                
                if(quota.Subscribers.some(mem => info.MemberKey == mem.Value1))
                    this.transactionToQuota(info, quota);
            });

            if(quota.To <= keyDay) {
                this.processQuotaReach(quota);
                this.SaveQuota(quota);
                this.LoadQuota();
                this.DL.Display("Quota Report", "Generated!");
            }
            else {
                let date = this.core.keyDayToDate(keyDay);
                date.setDate(date.getDate() + 1);
                let nextKeyDay = this.core.dateToKeyDay(date);
                this.GenerateQuota(quota, nextKeyDay);
            }
        });
    }

    private processQuotaReach(quota: QuotaInfo) {
        quota.Purchases.forEach(purchase => {
            purchase.HadQuota = true;

            if(quota.Products != null && quota.Products.length > 0) {
                quota.Products.forEach(product => {
                    let buyCount = 0;
                    purchase.items.forEach(item => {
                        if(item.Name == product.Name)
                            buyCount+= item.Value1;
                    });

                    if(product.Quota > buyCount)
                        purchase.HadQuota = false;
                });
            }
        })
    }

    private transactionToQuota(info: TransactionInfo, quota: QuotaInfo) {
        let purchase: PurchaseInfo = quota.Purchases.find(pur => pur.MemberKey == info.MemberKey);

        info.Items.forEach(sell => {
            if(sell.Code != this.DL.KEYSUBSCRIPTION && sell.Code != this.DL.KEYDISCOUNT) {
                if(purchase.items.some(p => (p.Name == sell.Description && p.Value2 == info.KeyDay))) {
                    let item = purchase.items.find(p => (p.Name == sell.Description && p.Value2 == info.KeyDay));
                    item.Value1 += sell.Quantity;
                }
                else {
                    let item = new Name2Value(sell.Description, sell.Quantity, info.KeyDay);
                    purchase.items.push(item);
                }
            }
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

            this.DL.SubscriptionQuotas.reverse();
        });
    }

    public DeleteQuota(item: QuotaInfo) {
        this.af.list(this.PATH_QUOTA).remove(item.key);
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