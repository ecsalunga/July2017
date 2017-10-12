import { DataLayer } from './../data.layer';
import { GalleryInfo, GalleryPhotoInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class GalleryDAL {
    PATH: string = "/galleries/items";
    PATH_PHOTO: string = "/galleries/photos";
    constructor(private DL: DataLayer, private af: AngularFireDatabase) {}

    public Load() {
        this.af.list(this.PATH, { query: { orderByChild: 'Order' }}).first().subscribe(snapshots => {
            this.DL.Galleries = new Array<GalleryInfo>();
            this.DL.GalleryActive = new Array<GalleryInfo>();
            snapshots.forEach(snapshot => {
                let info: GalleryInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Galleries.push(info);

                if(info.IsActive)
                    this.DL.GalleryActive.push(info);
            });

            this.DL.GalleryCount = this.DL.GalleryActive.length;
        });
    }

    public LoadPhotos() {
        this.af.list(this.PATH_PHOTO, { query: { orderByChild: 'GalleryKey' } }).subscribe(snapshots => {
            this.DL.GalleryPhotos = new Array<GalleryPhotoInfo>();
            snapshots.forEach(snapshot => {
                let info: GalleryPhotoInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.GalleryPhotos.push(info);
            });
        });
    }

    public SavePhoto(item: GalleryPhotoInfo) {
        if (item.key)
            this.af.list(this.PATH_PHOTO).update(item.key, item);
        else
            this.af.list(this.PATH_PHOTO).push(item);
    }

    public Save(item: GalleryInfo) {
        if (item.key)
            this.af.list(this.PATH).update(item.key, item);
        else
            this.af.list(this.PATH).push(item);
    }
}