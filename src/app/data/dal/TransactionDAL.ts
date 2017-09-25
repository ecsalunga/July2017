import { Core } from './../../core';
import { DataLayer, DataAccess } from './../../data';
import { SellInfo, TransactionInfo, ReportInfo, DeliveryInfo, NameValue, UserInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class TransactionDAL {
    PATH: string = "/transactions/items";
    PATH_DELIVERY: string = "/transactions/deliveryInfos";
    constructor(private core: Core, private DL: DataLayer, private DA: DataAccess, private af: AngularFireDatabase) {}

    LoadByKeyDay(keyDay: number) {
        this.af.list(this.PATH, { query: { orderByChild: this.DL.KEYDAY, equalTo: keyDay } }).first().subscribe(snapshots => {
            this.DL.Transactions = new Array<TransactionInfo>();
            this.DL.ReportSelected.SaleCount = 0;
            this.DL.ReportSelected.SaleAmount = 0;

            snapshots.forEach(snapshot => {
                let info: TransactionInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Transactions.push(info);

                this.DL.ReportSelected.SaleCount += snapshot.Count;
                this.DL.ReportSelected.SaleAmount += snapshot.Amount;
            });

            this.DL.Transactions.reverse();
        });
    }

    public LoadDelivery() {
        this.af.list(this.PATH_DELIVERY).subscribe(snapshots => {
            this.DL.DeliveryInfos = new Array<DeliveryInfo>();

            snapshots.forEach(snapshot => {
                let info: DeliveryInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.DeliveryInfos.push(info);
                
                if(this.DL.DeliveryToggledModule != null && this.DL.DeliveryStamp > 0 && info.ActionStart == this.DL.DeliveryStamp)
                {
                    this.DL.Delivery = info;
                    this.DL.LoadFromLink("delivery-detail");
                }
            });
        });
    }

    public Save(item: TransactionInfo) {
        this.af.list(this.PATH).push(item);
    }

    public SellDone(user: UserInfo,  memberKey: string, buyerName: string, isDelivery: boolean) {
        let info = new TransactionInfo();
        info.MemberKey = memberKey
        info.BuyerName = buyerName;
        info.UserKey = user.key;
        info.UserName = user.Name;
        info.Items = user.Sells;
        info.Count = this.DL.SellInfosCount;
        info.Amount = this.DL.SellInfosAmount;
        info.ActionDate = this.DL.GetActionDate();
        info.KeyDay = this.DL.KeyDay;
        info.Source = this.DL.SOURCE_COUNTER;

        if(isDelivery) {
            if(this.DL.ModuleSetting.DeliveryIsToggleSell)
                this.DL.DeliveryToggledModule = "product-sell";
                
            this.DL.DeliveryStamp = this.DL.GetActionDate();
            this.DeliveryStart(info);
        }
        else {
            this.DA.TransactionInfoSave(info);
            this.DA.ProductUpdate(info.Items);
        }

        this.DA.SellInfoClear(user);
    }

    public DeliveryStart(info: TransactionInfo) {
        let item = new DeliveryInfo();
        item.UserKey = this.DL.UserPending.key;
        item.UserName = this.DL.UserPending.Name;
        item.Transaction = info;
        item.ActionStart = this.DL.DeliveryStamp;
        this.DL.DeliveryGetInfo(item);
        this.DL.StatusUpdate(item, this.DL.STATUS_CREATED);
        this.DeliverySave(item);
    }

    public DeliverySave(item: DeliveryInfo) {
        if (item.key)
            this.af.list(this.PATH_DELIVERY).update(item.key, item);
        else
            this.af.list(this.PATH_DELIVERY).push(item);
    }

    public DeliveryToTransaction(info: DeliveryInfo) {
        this.DL.StatusInject(info, this.DL.STATUS_SAVEDTO_TRANSACT);
        info.IsTransaction = true;
        info.Transaction.ActionDate = this.DL.GetActionDate();
        info.Transaction.KeyDay = this.DL.KeyDay;
        info.Transaction.IsDelivered = true;
        this.DeliverySave(info);
        this.DA.TransactionInfoSave(info.Transaction);
        this.DA.ProductUpdate(info.Transaction.Items);
    }

    public DeliveryDelete(item: DeliveryInfo) {
        this.af.list(this.PATH_DELIVERY).remove(item.key);
    }
}