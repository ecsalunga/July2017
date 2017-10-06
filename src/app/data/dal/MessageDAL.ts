import { EventEmitter } from '@angular/core';
import { DataLayer, DataAccess} from './../';
import { ConversationInfo, MessageInfo } from '../models';
import { AngularFireDatabase } from 'angularfire2/database';

export class MessageDAL {
    MessageReceived: EventEmitter<any> = new EventEmitter();
    PATH: string = "/messages/conversations";
    PATH_MESSAGE: string = "/messages/items";

    constructor(private DL: DataLayer, private DA: DataAccess, private af: AngularFireDatabase) { }

    public Load() {
        this.af.list(this.PATH, { query: { orderByChild: 'ActionDate' } }).subscribe(snapshots => {
            this.DL.Conversations = new Array<ConversationInfo>();
            snapshots.forEach(snapshot => {
                let info: ConversationInfo = snapshot;
                info.key = snapshot.$key;

                if(this.DL.User.key == info.FromKey || this.DL.User.key == info.ToKey)
                    this.DL.Conversations.push(info);
            });

            if(!this.DL.IsMessageLoaded) {
                this.af.list(this.PATH_MESSAGE, { query: { orderByChild: 'ConversationKey' } }).subscribe(snapshots => {
                    this.DL.Messages = new Array<MessageInfo>();
        
                    snapshots.forEach(snapshot => {
                        let info: MessageInfo = snapshot;
                        info.key = snapshot.$key;
        
                        if(this.DL.Conversation && this.DL.Conversation.key == info.ConversationKey) {
                            this.DL.Messages.push(info);
                        }
                    });
        
                    this.DL.Messages.sort((item1, item2) => item1.ActionDate - item2.ActionDate);
                    
                    if(this.DL.Messages.length > 0)
                        this.MessageReceived.emit(null);

                    if(!this.DL.IsMessageLoaded) {
                        this.DA.DataLoaded.emit(this.DL.DATA_MESSAGE);
                        this.DL.IsMessageLoaded = true;
                    }
                });
            }
        });
    }

    public GetMessages(item: ConversationInfo) {
        this.af.list(this.PATH_MESSAGE, { query: { orderByChild: 'ConversationKey', equalTo: item.key } }).first().subscribe(snapshots => {
            this.DL.Messages = new Array<MessageInfo>();

            snapshots.forEach(snapshot => {
                let info: MessageInfo = snapshot;
                info.key = snapshot.$key;

                if(item.key == info.ConversationKey) {
                    this.DL.Messages.push(info);
                }
            });
            
            this.DL.Messages.sort((item1, item2) => item1.ActionDate - item2.ActionDate);
        });
    }

    public ConversationSave(item: ConversationInfo) {
        if (item.key)
            this.af.list(this.PATH).update(item.key, item);
        else
            this.af.list(this.PATH).push(item);
    }

    public ConversationDelete(item: ConversationInfo) {
        this.DL.Messages.forEach(message =>
        {
            if(message.ConversationKey == item.key)
                this.MessageDelete(message);
        });

        this.af.list(this.PATH).remove(item.key);
    }

    public MessageSave(item: MessageInfo) {
        this.af.list(this.PATH_MESSAGE).push(item);
    }

    public MessageDelete(item: MessageInfo) {
        this.af.list(this.PATH_MESSAGE).remove(item.key);
    }
}