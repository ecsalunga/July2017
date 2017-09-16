import { Component, OnInit } from '@angular/core';
import { Core } from '../../core';
import { DataLayer } from '../../data';
import { ConversationInfo } from '../../data/models';

@Component({
  selector: 'message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {

  constructor(private core: Core, public DL: DataLayer) { }
  
  SelectItem(item: ConversationInfo) {
    this.DL.Conversation = item;
    this.LoadDetail();
  }

  Message(item: ConversationInfo) {
    this.DL.Conversation = item;
    this.DL.LoadFromLink("message-message");
  }

  AddItem() {
    this.DL.Conversation = null;
    this.LoadDetail();
  }

  LoadDetail() {
    this.DL.LoadFromLink("message-detail");
  }

  ngOnInit() { 
    this.DL.TITLE = "Messages";
  }
}
