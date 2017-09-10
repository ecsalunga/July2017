export class ModuleSettingInfo {
    ModuleIsNotify: boolean;
    
    DeliveryMaxMinutes: number;
    DeliveryIsToggleSell: boolean
}

export class SystemSettingInfo {
    Name: string;
    Footer: string;
    DefaultImageURL: string;
    
    HomeTitle: string;

    NotificationDuration: number;
    NotificationSlowDuration: number;

    UserDefaultAccess: string;
    IsSystemUser: boolean;
}