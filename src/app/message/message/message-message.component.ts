import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Core } from '../../core';
import { DataAccess, DataLayer } from '../../data';
import { ConversationInfo, MessageInfo, CommandInfo } from '../../data/models';

@Component({
  selector: 'message-message',
  templateUrl: './message-message.component.html',
  styleUrls: ['./message-message.component.css']
})
export class MessageMessageComponent implements OnInit {
  @ViewChild('chatMessages', {read: ViewContainerRef })
  chatMessages: ViewContainerRef;

  message: string;

  constructor(private core: Core, private DA: DataAccess, public DL: DataLayer) { 
    if(this.DL.Conversation)
      this.DA.MessageGet(this.DL.Conversation);
  }

  Popup() {
    if(this.DL.Conversation) {
      let info = new CommandInfo();
      info.ComandType = this.DL.COMMAND_POPCHAT;
      info.UserKey = (this.DL.User.key != this.DL.Conversation.FromKey ? this.DL.Conversation.FromKey : this.DL.Conversation.ToKey);
      info.Data = this.DL.Conversation.key;
      this.DA.CommandSave(info);
      this.DL.Display("Popup Command", "Submitted!");
    }
  }

  Load(item: ConversationInfo) {
    this.DL.Conversation = item;
    this.DA.MessageGet(this.DL.Conversation);
  }

  Send() {
    this.DA.MessageSend(this.message);
    this.message = "";
  }

  ScrollBottom() {
    try {
      this.chatMessages.element.nativeElement.scrollTop = this.chatMessages.element.nativeElement.scrollHeight;
    } catch(err) { }
  }

  IsFromYou(item: MessageInfo): boolean {
    return (item.FromKey == this.DL.User.key);
  }

  GetConvoWith(item: ConversationInfo) {
    return (item.FromKey == this.DL.User.key) ? item.ToName : item.FromName;
  }

  ngOnInit() {
    this.DL.TITLE = "Conversations";

    this.DA.messageDAL.MessageReceived.subscribe(msg => {
      this.ScrollBottom();
    });
  }
}
