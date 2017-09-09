import { Component, OnInit, ApplicationRef, ViewChild, ViewContainerRef, Renderer } from '@angular/core';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { UserInfo } from '../../data/models';

@Component({
  selector: 'member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('fileSelector', {read: ViewContainerRef })
  fileSelector: ViewContainerRef;
  joinDate: Date;
  model: UserInfo;
  isLoaded: boolean = true;

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer, private renderer: Renderer) {
    if (this.DL.UserSelected) {
      this.model = Object.assign({}, this.DL.UserSelected);
      this.joinDate = this.core.numberToDate(this.model.JoinDate);
    }
    else {
      this.model = new UserInfo(this.DL.DefaultImageURL);
      this.model.IsMember = true;
      this.joinDate = this.DL.Date;
    }
  }

  Save() {
    this.model.JoinDate = this.core.dateToNumber(this.joinDate);
    this.DA.UserSave(this.model);
    this.LoadList();
    this.DL.Display("Member Details", "Saved!");
  }

  selectFile() {
    this.fileSelector.element.nativeElement.click();
  }

  upload() {
    this.isLoaded = false;
    let selectedFile = (<HTMLInputElement>this.fileSelector.element.nativeElement).files[0];
    let fRef = this.DA.StorageRef.child("images/users/" + this.model.UID + "_" + selectedFile.name);
    fRef.put(selectedFile).then(snapshot => {
        this.model.SystemImageURL = snapshot.downloadURL;
    });
  }

  resetPicture() {
    if(this.model.ImageURL)
      this.model.SystemImageURL = this.model.ImageURL;
  }

  imageLoaded() {
    this.isLoaded = true;
  }

  LoadList() {
    this.DL.LoadFromLink("member-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Member Details";

    this.renderer.listen(this.fileSelector.element.nativeElement, 'change', (event) => {
      this.upload();
    });
  }
}
