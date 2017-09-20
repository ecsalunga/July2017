export class ModuleSettingInfo {
    ModuleIsNotify: boolean;
    PublicIsNotify: boolean;
   
    DefaultPage: string;
    HomeTitle: string;

    ShowcseCartItemMax: number;

    DeliveryMaxMinutes: number;
    DeliveryIsToggleSell: boolean;
    DeliveryIsToggleOrder: boolean;
}

export class SystemSettingInfo {
    Name: string;
    Footer: string;
    CurrencySymbol: string;
    
    NotificationDuration: number;
    NotificationSlowDuration: number;

    DefaultAccess: string;
    DefaultIsSystemUser: boolean;
    DefaultImageURL: string;
}