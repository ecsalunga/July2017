import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ConversationInfo, UserInfo, CommandInfo, MessageInfo } from '../../data/models';

@Component({
  selector: 'message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.css']
})
export class MessageDetailComponent implements OnInit {
  model: ConversationInfo;
  user: UserInfo;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) {
    if (this.DL.Conversation) {
      this.model = Object.assign({}, this.DL.Conversation);
      this.DL.UserAll.forEach(user => {
        if((this.DL.User.key != this.model.ToKey && this.model.ToKey == user.key)
            || (this.DL.User.key != this.model.FromKey && this.model.FromKey == user.key))
          this.user = user;
      });
    }
    else
      this.model = new ConversationInfo();
  }

  Delete() {
    this.DA.ConversationDelete(this.model);
    this.LoadList();
    this.DL.Display("Conversation", "Deleted!");
  }

  Save() {
    if(!this.model.key) {
      this.model.ActionDate = this.DL.GetActionDate();
      this.model.ToKey = this.user.key;
      this.model.ToName = this.user.Name;
      this.model.FromKey = this.DL.User.key;
      this.model.FromName = this.DL.User.Name;
    }
    
    this.DA.ConversationSave(this.model);
    this.LoadList();
    this.DL.Display("Conversation Details", "Saved!");
  }

  LoadList() {
    this.DL.LoadFromLink("message-list");
  }

  ngOnInit() {
    this.DL.TITLE = "Conversation Details";
  }
}
