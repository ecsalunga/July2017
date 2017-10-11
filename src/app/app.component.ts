import { Component, OnInit, ViewChild, ViewContainerRef, Renderer } from '@angular/core';
import { Core } from './core';
import { DataAccess, DataLayer } from './data';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: Array<NgxGalleryImage>;

  @ViewChild('viewChild', {read: ViewContainerRef})
  viewChild: ViewContainerRef;

  @ViewChild('imageSelector', {read: ViewContainerRef })
  imageSelector: ViewContainerRef;
  isLoaded: boolean = false;
  showInfo: boolean = false;
  showGallery: boolean = false;
  show: string = "100%";
  hide: string = "0%"
  navWidth: string = "0%";
  loader: string = "100%";
  viewWidth: number;

  constructor(public core: Core, private DA: DataAccess, public DL: DataLayer, private renderer: Renderer) {}

  GetDate(actionDate: number): Date {
    return this.core.numberToDate(actionDate);
  }

  onResize(event) {
    this.DL.ViewWidth = event.target.innerWidth; 
  }

  LoadPage(name: string) {
    this.DL.LoadFromMenu(name);
  }

  LoadPageWithNullSelectedUser(name: string) {
    this.DL.UserSelected = null;
    this.DL.LoadFromMenu(name);
  }

  Login() {
    this.LoadFromHeader('user-login');
  }

  LoadFromHeader(name: string) {
    this.navWidth = this.hide;
    this.LoadPage(name)
  }

  ToggleNav() {
    this.navWidth = (this.navWidth == this.show) ? this.hide : this.show;
  }

  Upload() {
    let nativeElement = (<HTMLInputElement>this.imageSelector.element.nativeElement);
    let selectedFile = nativeElement.files[0];
    if(selectedFile.type.indexOf("image") > -1) {
      if((selectedFile.size / 1024) <= this.DL.SystemSetting.ImageSize) {
        this.DA.DataChecked.emit(true);
        let fRef = this.DA.StorageRef.child(this.DL.UploadingImageBasePath + selectedFile.name);
        fRef.put(selectedFile).then(snapshot => {
          this.DA.ImageUploaded.emit(snapshot.downloadURL);
          nativeElement.value = "";
        });
      } else {
        nativeElement.value = "";
        this.DA.DataChecked.emit(false);
        this.DL.Display("Image", "Image more than " + this.DL.SystemSetting.ImageSize + " KB size.");
      }
    }
    else {
      nativeElement.value = "";
      this.DA.DataChecked.emit(false);
      this.DL.Display("Image", "Please select valid image file.");
    }
  }

  HideInfo() {
    this.showInfo = false;
    this.loader =  this.hide;
  }

  HideGallery() {
    this.showGallery = false;
    this.loader =  this.hide;
  }

  ngOnInit() {
    this.core.viewChild = this.viewChild;
    this.core.imageSelector = this.imageSelector;
    this.DA.DataLoad();
    this.DA.DataLoaded.subscribe(data => {
      if(data == this.DL.DATA_USER) {
        this.isLoaded = true;
        this.loader =  this.hide;
      } else if(data == this.DL.DATA_INFO) {
        this.showInfo = true;
        this.loader =  this.show;
      } else if(data == this.DL.DATA_GALLERY) {
        this.galleryImages = new Array<NgxGalleryImage>();
        this.DL.GallerySelectedPhotos.forEach(i => {
          let image = {
            small: i.ImageURL,
            medium: i.ImageURL,
            big: i.ImageURL,
            description: i.Description
          };
          this.galleryImages.push(image);
        });
        this.galleryOptions = [
          {
              width: this.DL.ViewWidth > 800 ? '800px' : this.DL.ViewWidth + 'px',
              imageAutoPlayInterval: 7000,
              imageSwipe: true,
              imageAutoPlay: true,
              imageArrowsAutoHide: true,
              thumbnailsArrowsAutoHide: true,
              previewSwipe: true,
              previewCloseOnEsc: true,
              previewCloseOnClick: true,
              previewAutoPlayPauseOnHover: true,
              thumbnailsColumns: 5,
              imageAnimation: NgxGalleryAnimation.Slide
          }
        ];

        this.showGallery = true;
        this.loader =  this.show;
      }
    });

    this.renderer.listen(this.imageSelector.element.nativeElement, 'change', (event) => {
      this.Upload();
    });

    this.DL.ViewWidth = window.innerWidth;
  }
}