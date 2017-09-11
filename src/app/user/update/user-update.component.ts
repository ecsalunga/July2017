import { Component, OnInit, ApplicationRef, ViewChild, ViewContainerRef, Renderer } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { UserInfo } from '../../data/models';

@Component({
  selector: 'user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  @ViewChild('fileSelector', {read: ViewContainerRef })
  fileSelector: ViewContainerRef;
  model: UserInfo;
  isLoaded: boolean = true;
  nameValidator = new FormControl('', [Validators.required]);
  
  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer, private renderer: Renderer) {
    this.model = Object.assign({}, this.DL.User);
  }

  Save() {
    this.DA.UserSave(this.model);
    this.DL.Display("User Profile", "Updated!");
  }

  SelectFile() {
    this.fileSelector.element.nativeElement.click();
  }

  Upload() {
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

  ResetPicture() {
    if(this.model.ImageURL)
      this.model.SystemImageURL = this.model.ImageURL;
  }

  ImageLoaded() {
    this.isLoaded = true;
  }

  ngOnInit() {
    this.DL.TITLE = "User Profile";

    this.renderer.listen(this.fileSelector.element.nativeElement, 'change', (event) => {
      this.Upload();
    });
  }
}
