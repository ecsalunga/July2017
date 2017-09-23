import { Component, OnInit } from '@angular/core';
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
  model: UserInfo;
  isLoaded: boolean = true;
  nameValidator = new FormControl('', [Validators.required]);
  
  constructor(private core: Core, public DA: DataAccess, public DL: DataLayer) {
    this.model = Object.assign({}, this.DL.User);
  }

  Save() {
    this.DA.UserSave(this.model);
    this.DL.Display("User Profile", "Updated!");
  }

  SelectFile() {
    this.DL.SelectImage("images/users/" + this.model.UID + "_");
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
    this.DA.ImageUploaded.subscribe(url => {
      this.model.SystemImageURL = url;
    });
    this.DA.DataChecked.subscribe(isValid => {
      if(isValid) 
        this.isLoaded = false;
    });
  }
}
