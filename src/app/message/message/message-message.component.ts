import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ConversationInfo, MessageInfo } from '../../data/models';

@Component({
  selector: 'message-message',
  templateUrl: './message-message.component.html',
  styleUrls: ['./message-message.component.css']
})
export class MessageMessageComponent implements OnInit {
  message: string;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) { 
    this.DA.MessageGet(this.DL.Conversation);
  }

  Load(item: ConversationInfo) {
    this.DL.Conversation = item;
    this.DA.MessageGet(this.DL.Conversation);
  }

  Send() {
    this.DA.MessageSend(this.message);
    this.message = "";
  }

  IsFromYou(item: MessageInfo): boolean {
    return (item.FromKey == this.DL.User.key);
  }

  GetConvoWith(item: ConversationInfo) {
    return (item.FromKey == this.DL.User.key) ? item.ToName : item.FromName;
  }

  ngOnInit() {
    this.DL.TITLE = "Massage Details";
  }
}