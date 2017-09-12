export class ModuleSettingInfo {
    ModuleIsNotify: boolean;
    CurrencySymbol: string;

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