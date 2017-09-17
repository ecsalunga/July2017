export class ModuleSettingInfo {
    ModuleIsNotify: boolean;
    PublicIsNotify: boolean;
    CurrencySymbol: string;
    DefaultPage: string;
    
    ShowcseCartItemMax: number;

    DeliveryMaxMinutes: number;
    DeliveryIsToggleSell: boolean
}

export class SystemSettingInfo {
    Name: string;
    Footer: string;
    HomeTitle: string;

    NotificationDuration: number;
    NotificationSlowDuration: number;

    DefaultAccess: string;
    DefaultIsSystemUser: boolean;
    DefaultImageURL: string;
}