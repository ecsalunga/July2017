import { Component, OnInit, ViewChild, ViewContainerRef, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DataAccess, DataLayer } from '../../data';
import { ConversationInfo, MessageInfo } from '../../data/models';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.css']
})
export class MessagePopupComponent implements OnInit {
  @ViewChild('chatMessages', {read: ViewContainerRef })
  chatMessages: ViewContainerRef;
  DA: DataAccess;
  DL: DataLayer;
  ConvoWith: string;

  message: string;

  constructor(public dialogRef: MdDialogRef<MessagePopupComponent>, @Inject(MD_DIALOG_DATA) public data: any) { 
    this.DA = data.DA;
    this.DL = data.DL;
    this.DA.messageDAL.MessageReceived.subscribe(msg => {
      this.ScrollBottom();
    });
    this.DA.MessageGet(this.DL.Conversation);
    this.ConvoWith = this.DL.Conversation.FromKey == this.DL.User.key ? this.DL.Conversation.ToName : this.DL.Conversation.FromName;
  }

  Close(): void {
    this.dialogRef.close();
  }

  GotoMessage() {
    this.Close();
    this.DL.LoadFromLink("message-message");
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

  ngOnInit() {
  }
}
