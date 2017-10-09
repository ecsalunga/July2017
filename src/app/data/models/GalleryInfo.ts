export class GalleryInfo {
    key: string;
    Name: string;
    Description: string;
    Order: number;
    IsActive: boolean;
}

export class GalleryPhotoInfo {
    key: string;
    GalleryKey: string;
    Name: string;
    Description: string;
    Order: number;
    IsActive: boolean;
    ImageURL: string;
    constructor(defaultImageURL: string) {
        this.ImageURL = defaultImageURL;
    }
}