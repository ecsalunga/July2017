import { Component, OnInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { UserInfo, CommandInfo } from '../../data/models';

@Component({
  selector: 'member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  joinDate: Date;
  model: UserInfo;
  isLoaded: boolean = true;
  nameValidator = new FormControl('', [Validators.required]);
  
  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
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

  GetDate(actionDate: number): Date {
    return this.core.numberToDate(actionDate);
  }

  IsHidden() : boolean {
    return !this.isLoaded || (!this.DL.UserAccess.MemberEdit && !(!this.model.key));
  }

  Logout() {
    let info = new CommandInfo();
    info.ComandType = this.DL.COMMAND_LOGOUT;
    info.UserKey = this.model.key;

    this.DA.CommandSave(info);
    this.DL.Display("Command", "Issued!");
  }

  Save() {
    this.model.JoinDate = this.core.dateToNumber(this.joinDate);
    this.DA.UserSave(this.model);
    this.LoadList();
    this.DL.Display("Member Details", "Saved!");
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
    this.DL.LoadFromLink("member-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Member Details";

    this.DA.ImageUploaded.subscribe(url => {
      this.model.SystemImageURL = url;
    });
    this.DA.DataChecked.subscribe(isValid => {
      if(isValid) 
        this.isLoaded = false;
    });
  }
}
