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

  constructor(public core: Core, private DA: DataAccess, public DL: DataLayer, private renderer: Renderer) {}

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
    let selectedFile = (<HTMLInputElement>this.imageSelector.element.nativeElement).files[0];
    if(selectedFile.type.indexOf("image") > -1) {
      this.DA.DataChecked.emit(true);
      let fRef = this.DA.StorageRef.child(this.DL.UploadingImageBasePath + selectedFile.name);
      fRef.put(selectedFile).then(snapshot => {
        this.DA.ImageUploaded.emit(snapshot.downloadURL);
      });
    }
    else {
      this.DA.DataChecked.emit(false);
      this.DL.Display("Image", "Please select valid image file.");
    }
  }

  ngOnInit() {
    this.core.viewChild = this.viewChild;
    this.core.imageSelector = this.imageSelector;
    this.DA.DataLoad();
    this.DA.DataLoaded.subscribe(data => {
      this.loader =  this.hide;
    });

    this.renderer.listen(this.imageSelector.element.nativeElement, 'change', (event) => {
      this.Upload();
    });
  }
}