import { Injectable } from '@angular/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import { Core } from './../core';
import { 
    ProductInfo, 
    SellInfo, 
    TransactionInfo, 
    ReportInfo, 
    ExpenseInfo, 
    NameValue, 
    UserInfo, 
    ShowcaseInfo, 
    AccessInfo, 
    CancelInfo,
    DeliveryInfo,
    ModuleSettingInfo,
    SystemSettingInfo,
    SnapshotInfo
} from './models';

@Injectable()
export class DataLayer {
    SnackBarConfig: MdSnackBarConfig;
    SnackBarConfigLong: MdSnackBarConfig;

    KEYDAY: string = "KeyDay";
    KEYMONTH: string = "KeyMonth";
    KEYDISCOUNT: string = "X";

    MENU: string = "MENU";
    LINK: string = "LINK";
    SOURCE: string;
    TITLE: string;

    STATUS_CREATED: string = "Created";
    STATUS_ASSIGNED: string = "Assigned";
    STATUS_IN_PROGRESS: string = "In-Progress";
    STATUS_DELIVERED: string = "Delivered";
    STATUS_CANCELLED: string = "Cancelled";

    Product: ProductInfo;
    Products: Array<ProductInfo>;
    ProductDiscount: ProductInfo;
    ProductSelections: Array<ProductInfo>;

    Transaction: TransactionInfo;
    TransactionsToday: Array<TransactionInfo>;
    TransactionSelected: Array<TransactionInfo>;
    
    TransactionCancels: Array<CancelInfo>;
    TransactionCancelSelected: Array<CancelInfo>;

    SellInfos: Array<SellInfo>;
    SellInfosAmount: number = 0;
    SellInfosCount: number = 0;

    Delivery: DeliveryInfo;
    DeliveryInfos: Array<DeliveryInfo>;
    DeliveryStatuses: Array<string>;
    DeliveryToggledStamp: number = 0;

    ExpenseTypes: Array<string>;
    ExpensesToday: Array<ExpenseInfo>;
    ExpenseSelected: Array<ExpenseInfo>;
    ExpenseAmount: number = 0;

    Report: ReportInfo;
    Reports: Array<ReportInfo>;
    ReportToday: ReportInfo;
    ReportSelected: ReportInfo;
    ReportYears: Array<number>;

    User: UserInfo;
    UserSelected: UserInfo;
    Users: Array<UserInfo>;
    UserAll: Array<UserInfo>;
    UserSelections: Array<UserInfo>;
    UserAccess: AccessInfo;
    UserPending: UserInfo;
    UserIsDefaultSystemUser: boolean;

    Members: Array<UserInfo>;
    MemberSelections: Array<UserInfo>;
    MemberWalkIn: UserInfo;

    Access: AccessInfo;
    Accesses: Array<AccessInfo>;
    AccessDefault: string;

    Showcase: ShowcaseInfo;
    Showcases: Array<ShowcaseInfo>;
    ShowcaseToday: Array<ShowcaseInfo>;

    Snapshot: SnapshotInfo;
    Snapshots: Array<SnapshotInfo>;

    Months: Array<NameValue>;
    Date: Date = new Date();
    AccessTypes: Array<NameValue>;
    IsAuthenticating: boolean = false;
    IsDataActiveLoaded: boolean = false;

    DefaultImageURL: string;

    ModuleSetting: ModuleSettingInfo;
    SystemSetting: SystemSettingInfo;

    constructor(private core: Core, private snackBar: MdSnackBar) {
        this.ReportTodayRefresh();
        this.ReportSelected = this.ReportToday;
        
        this.ReportYears = new Array<number>();
        for (let x = this.ReportToday.KeyYear - 5; x <= this.ReportToday.KeyYear; x++) {
            this.ReportYears.push(x);
        }

        this.Months = [
            new NameValue("January", 1),
            new NameValue("February", 2),
            new NameValue("March", 3),
            new NameValue("April", 4),
            new NameValue("May", 5),
            new NameValue("June", 6),
            new NameValue("July", 7),
            new NameValue("August", 8),
            new NameValue("September", 9),
            new NameValue("October", 10),
            new NameValue("November", 11),
            new NameValue("December", 12)
        ];

        this.AccessTypes = [
            new NameValue("Administrator", 1),
            new NameValue("Manager", 2),
            new NameValue("Staff", 3),
            new NameValue("User", 4),
            new NameValue("Guest", 0)
        ];

        this.DeliveryStatuses = [
            this.STATUS_CREATED,
            this.STATUS_ASSIGNED,
            this.STATUS_IN_PROGRESS,
            this.STATUS_DELIVERED,
            this.STATUS_CANCELLED
        ];

        this.ProductDiscount = new ProductInfo();
        this.ProductDiscount.Code = this.KEYDISCOUNT;
        this.ProductDiscount.Description = "Discount";
        this.ProductDiscount.key = this.KEYDISCOUNT;

        this.MemberWalkIn = new UserInfo(this.DefaultImageURL);
        this.MemberWalkIn.Name = "Walk-In";
        this.MemberWalkIn.key = "Walk-In";

        this.UserPending = new UserInfo(this.DefaultImageURL);
        this.UserPending.Name = "Pending";
        this.UserPending.key = "Pending";

        this.ModuleSetting = new ModuleSettingInfo();
        this.SystemSetting = new SystemSettingInfo();
        
        this.User = new UserInfo(this.DefaultImageURL);
        this.UserAccess = new AccessInfo();

        this.SnackBarConfig = new MdSnackBarConfig();
        this.SnackBarConfig.extraClasses = ['snackBarclass']; 
        this.SnackBarConfig.duration = 2500;

        this.SnackBarConfigLong = new MdSnackBarConfig();
        this.SnackBarConfigLong.extraClasses = ['snackBarclassLong']; 
        this.SnackBarConfigLong.duration = 10000;
    }

    public SetSystemConfig() {
        this.SnackBarConfig.duration = this.SystemSetting.NotificationDuration;
        this.SnackBarConfigLong.duration = this.SystemSetting.NotificationSlowDuration;
        this.AccessDefault = this.SystemSetting.UserDefaultAccess;
        this.UserIsDefaultSystemUser = this.SystemSetting.IsSystemUser;
        this.DefaultImageURL = this.SystemSetting.DefaultImageURL;
    }

    public ReportTodayRefresh()
    {
        this.ReportToday = new ReportInfo();
        this.ReportToday.KeyDay = this.core.dateToKeyDay(this.Date);
        this.ReportToday.KeyMonth = this.core.dateToKeyMonth(this.Date);
        this.ReportToday.KeyYear = this.Date.getFullYear();
    }

    public SetPermission() {
        this.UserAccess = new AccessInfo();
        
        if (this.User && this.Accesses) {
            this.Accesses.forEach(access => {
                if (this.User.AccessKey == access.key)
                    this.UserAccess = access;
            });
        }
    }

    public DeliveryUpdateStatus(item: DeliveryInfo, status: string) {
        item.Status = status;
        item.ActionLast = this.GetActionDate();
        let action = new NameValue(item.Status, item.ActionLast);
        item.Actions.push(action);
    }

    public DeliveryGetInfo(item: DeliveryInfo) {
        this.Members.forEach(info => {
            if(item.Transaction.MemberKey == info.key) {
                item.Address = info.Address1 + this.appendIfSet(info.Address2);
                item.Contact = info.Contact1 + this.appendIfSet(info.Contact2);
            }
        });
    }
    
    private appendIfSet(value: string): string {
        if(value)
            return ", " + value;
        
        return "";
    }

    public GetActionDate(): number {
        return this.core.dateToNumber(new Date());
    }

    public GetKeyDay(): number {
        return this.core.dateToKeyDay(this.Date);
    }

    public GetKeyMonth(): number {
        return this.core.dateToKeyMonth(this.Date);
    }

    public LoadFromMenu(name: string) {
        this.SOURCE = this.MENU;
        this.core.loadComponent(name);
        this.GotoTop();
    }

    public LoadFromLink(name: string) {
        this.SOURCE = this.LINK;
        this.core.loadComponent(name);
        this.GotoTop();
    }

    public LoadComponentsFromLink(names: Array<string>) {
        this.SOURCE = this.LINK;
        this.core.loadComponents(names);
        this.GotoTop();
    }

    public GotoTop() {
        window.scroll(0, 0);
    }

    public Display(message: string, action: string) {
        if(this.ModuleSetting.ModuleIsNotify) {
            this.snackBar.open(message, action, this.SnackBarConfig);
        }
    }

    public DisplayLong(message: string, action: string) {
        this.snackBar.open(message, action, this.SnackBarConfigLong);
    }
}