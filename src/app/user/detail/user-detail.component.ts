import { Component, OnInit, ApplicationRef, ViewChild, ViewContainerRef, Renderer } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { UserInfo } from '../../data/models';

@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @ViewChild('fileSelector', {read: ViewContainerRef })
  fileSelector: ViewContainerRef;
  joinDate: Date;
  model: UserInfo;
  isLoaded: boolean = true;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer, private renderer: Renderer) {
    this.model = Object.assign({}, this.DL.UserSelected);
    this.joinDate = this.core.numberToDate(this.model.JoinDate);
  }

  Save() {
    this.model.JoinDate = this.core.dateToNumber(this.joinDate);
    this.DA.UserSave(this.model);
    this.LoadList();
    this.DL.Display("User Details", "Saved!");
  }

  selectFile() {
    this.fileSelector.element.nativeElement.click();
  }

  upload() {
    let selectedFile = (<HTMLInputElement>this.fileSelector.element.nativeElement).files[0];
    if(selectedFile.type.indexOf("image") > -1) {
      this.isLoaded = false;
      let fRef = this.DA.StorageRef.child("images/users/" + this.model.UID + "_" + selectedFile.name);
      fRef.put(selectedFile).then(snapshot => {
          this.model.SystemImageURL = snapshot.downloadURL;
      });
    }
    else
      this.DL.Display("Image", "Please select valid image file.");
  }

  resetPicture() {
    if(this.model.ImageURL)
      this.model.SystemImageURL = this.model.ImageURL;
  }

  imageLoaded() {
    this.isLoaded = true;
  }

  LoadList() {
    this.DL.LoadFromLink("user-list");
  }

  ngOnInit() {
    this.DL.TITLE = "User Details";

    this.renderer.listen(this.fileSelector.element.nativeElement, 'change', (event) => {
      this.upload();
    });
  }
}
