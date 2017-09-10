import { DataLayer } from './../data.layer';
import { ProductInfo, SellInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class ProductDAL {
    PATH: string = "/products";
    constructor(private DL: DataLayer, private af: AngularFireDatabase) {}

    public Load() {
        this.af.list(this.PATH, { query: { orderByChild: 'Description' } }).subscribe(snapshots => {
            this.DL.Products = new Array<ProductInfo>();
            this.DL.ProductSelections = new Array<ProductInfo>();

            snapshots.forEach(snapshot => {
                let info: ProductInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Products.push(info);
                if (info.Quantity > 0)
                    this.DL.ProductSelections.push(info);
            });

            this.DL.ProductSelections.push(this.DL.ProductDiscount);
        });
    }

    public Save(item: ProductInfo) {
        if (item.key)
            this.af.list(this.PATH).update(item.key, item);
        else
            this.af.list(this.PATH).push(item);
    }

    public UpdateProducts(infos: Array<SellInfo>) {
        let items = Array<ProductInfo>();
        
        // update in memory first to prevent data sync issue
        infos.forEach(sell => {
            this.DL.Products.forEach(product => {
                if (sell.Code == product.Code) {
                    product.Quantity -= sell.Quantity;
                    items.push(product);
                }
            });
        });

        // do the actual database update
        items.forEach(item => {
            this.Save(item);
        });
    }
}