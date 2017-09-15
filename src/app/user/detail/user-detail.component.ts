import { Component, OnInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { UserInfo } from '../../data/models';

@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  joinDate: Date;
  model: UserInfo;
  isLoaded: boolean = true;
  nameValidator = new FormControl('', [Validators.required]);

  constructor(private core: Core, private DA: DataAccess, private DL: DataLayer) {
    this.model = Object.assign({}, this.DL.UserSelected);
    this.joinDate = this.core.numberToDate(this.model.JoinDate);
  }

  Save() {
    this.model.JoinDate = this.core.dateToNumber(this.joinDate);
    this.DA.UserSave(this.model);
    this.LoadList();
    this.DL.Display("User Details", "Saved!");
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

  LoadList() {
    this.DL.LoadFromLink("user-list");
  }

  ngOnInit() {
    this.DL.TITLE = "User Details";

    this.DA.ImageUploaded.subscribe(url => {
      this.model.SystemImageURL = url;
    });
    this.DA.DataChecked.subscribe(isValid => {
      if(isValid) 
        this.isLoaded = false;
    });
  }
}
