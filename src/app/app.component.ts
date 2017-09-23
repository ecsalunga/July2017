import { Component, OnInit, ViewChild, ViewContainerRef, Renderer } from '@angular/core';
import { Core } from './core';
import { DataAccess, DataLayer } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('viewChild', {read: ViewContainerRef})
  viewChild: ViewContainerRef;

  @ViewChild('imageSelector', {read: ViewContainerRef })
  imageSelector: ViewContainerRef;

  show: string = "100%";
  hide: string = "0%"
  navWidth: string = "0%";
  loader: string = "100%";
  viewWidth: number;

  constructor(public core: Core, private DA: DataAccess, public DL: DataLayer, private renderer: Renderer) {}

  onResize(event) {
    this.DL.ViewWidth = event.target.innerWidth; 
  }

  LoadPage(name: string) {
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
        this.DL.Display("Image", "Please select image with maximum " + this.DL.SystemSetting.ImageSize + " KB size.");
      }
    }
    else {
      nativeElement.value = "";
      this.DA.DataChecked.emit(false);
      this.DL.Display("Image", "Please select valid image file.");
    }
  }

  ngOnInit() {
    this.core.viewChild = this.viewChild;
    this.core.imageSelector = this.imageSelector;
    this.DA.DataLoad();
    this.DA.DataLoaded.subscribe(data => {
      if(data == this.DL.DATA_USER)
        this.loader =  this.hide;
    });

    this.renderer.listen(this.imageSelector.element.nativeElement, 'change', (event) => {
      this.Upload();
    });

    this.DL.ViewWidth = window.innerWidth;
  }
}