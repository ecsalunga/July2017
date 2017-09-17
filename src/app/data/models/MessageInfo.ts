export class ConversationInfo {
    key: string;
    FromKey: string;
    FromName: string;
    ToKey: string;
    ToName: string;
    ActionDate: number;
}

export class MessageInfo {
    key: string;
    ConversationKey: string;
    FromKey: string;
    Message: string;
    ActionDate: number;
}