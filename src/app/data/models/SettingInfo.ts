export class ModuleSettingInfo {
    ModuleIsNotify: boolean;
    PublicIsNotify: boolean;
    PromptMissingProfileData: boolean;
   
    DefaultPage: string;
    HomeTitle: string;

    ShowcseCartItemMax: number;
    ServiceReservationMax: number;

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