import { Injectable } from '@angular/core';
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
    SettingInfo
} from './../models';

@Injectable()
export class DataLayer {
    MainContent: HTMLElement;

    KEYDAY: string = "KeyDay";
    KEYMONTH: string = "KeyMonth";
    
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

    Members: Array<UserInfo>;
    MemberSelections: Array<UserInfo>;
    MemberWalkIn: UserInfo;

    Access: AccessInfo;
    Accesses: Array<AccessInfo>;

    Showcase: ShowcaseInfo;
    Showcases: Array<ShowcaseInfo>;
    ShowcaseToday: Array<ShowcaseInfo>;

    Months: Array<NameValue>;
    Date: Date = new Date();
    AccessTypes: Array<NameValue>;
    IsAuthenticating: boolean = false;
    IsDataActiveLoaded: boolean = false;

    Setting: SettingInfo;

    constructor(private core: Core) {
        this.ReportToday = new ReportInfo();
        this.ReportToday.KeyDay = this.core.dateToKeyDay(this.Date);
        this.ReportToday.KeyMonth = this.core.dateToKeyMonth(this.Date);
        this.ReportToday.KeyYear = this.Date.getFullYear();
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

        this.MemberWalkIn = new UserInfo();
        this.MemberWalkIn.Name = "Walk-In";
        this.MemberWalkIn.key = "Walk-In";

        this.UserPending = new UserInfo();
        this.UserPending.Name = "Pending";
        this.UserPending.key = "Pending";

        this.Setting = new SettingInfo();
        
        this.User = new UserInfo();
        this.UserAccess = new AccessInfo();
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
        this.MainContent.scrollTop = 0;
    }

    public LoadFromLink(name: string) {
        this.SOURCE = this.LINK;
        this.core.loadComponent(name);
        this.MainContent.scrollTop = 0;
    }

    public LoadComponentsFromLink(names: Array<string>) {
        this.SOURCE = this.LINK;
        this.core.loadComponents(names);
        this.MainContent.scrollTop = 0;
    }
}