import { DataLayer } from './../data.layer';
import { ArticleInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class ArticleDAL {
    PATH: string = "/articles";
    constructor(private DL: DataLayer, private af: AngularFireDatabase) { }

    public Load() {
        this.af.list(this.PATH, { query: { orderByChild: 'Order' } }).first().subscribe(snapshots => {
            this.DL.Articles = new Array<ArticleInfo>();
            this.DL.ArticleLive = new Array<ArticleInfo>();
            this.DL.ArticleCount = 0;

            snapshots.forEach(snapshot => {
                let info: ArticleInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Articles.push(info);

                if(info.IsActive)
                    this.DL.ArticleLive.push(info);
            });

            this.DL.ArticleCount = this.DL.ArticleLive.length;
        });
    }

    public Save(item: ArticleInfo) {
        if (item.key)
            this.af.list(this.PATH).update(item.key, item);
        else
            this.af.list(this.PATH).push(item);
    }
}