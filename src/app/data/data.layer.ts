import { Injectable } from '@angular/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import { Core } from './../core';
import { 
    ProductInfo, SellInfo, TransactionInfo, 
    ReportInfo, ExpenseInfo, NameValue, 
    UserInfo, ShowcaseInfo, AccessInfo, 
    CancelInfo, DeliveryInfo, ModuleSettingInfo,
    SystemSettingInfo, SnapshotInfo, OrderInfo,
    ServiceInfo, ConversationInfo, MessageInfo,
    ReservationInfo
} from './models';

@Injectable()
export class DataLayer {
    MSG_MISSING_PROFILE_DATA: string = "Please ensure that your contact/address details are updated by clicking on the top right icon.";

    SnackBarConfig: MdSnackBarConfig;
    SnackBarConfigLong: MdSnackBarConfig;

    KEYDAY: string = "KeyDay";
    KEYMONTH: string = "KeyMonth";
    KEYDISCOUNT: string = "X";

    MENU: string = "MENU";
    LINK: string = "LINK";
    PUBLIC: string = "PUBLIC";

    COMPONENT: string;
    SOURCE: string;
    SOURCE_COUNTER: string = "Counter";
    SOURCE_ORDER: string = "Order";
    TITLE: string;

    STATUS_CREATED: string = "Created";
    STATUS_ASSIGNED: string = "Assigned";
    STATUS_IN_PROGRESS: string = "In-Progress";
    STATUS_READY_PICKUP: string = "Ready for Pickup";
    STATUS_FOR_DELIVERY: string = "Set for Delivery";
    STATUS_DELIVERY_CREATED: string = "Delivery Created";
    STATUS_DELIVERED: string = "Delivered";
    STATUS_CANCELLED: string = "Cancelled";
    STATUS_SELECTING: string = "Selecting";
    STATUS_REQUESTED: string = "Requested";
    STATUS_CONFIRMED: string = "Confirmed";
    STATUS_REJECTED: string = "Rejected";
    STATUS_NOSHOW: string = "No-show";
    STATUS_DELAYED: string = "Delayed";
    STATUS_SAVEDTO_TRANSACT: string = "Saved to Transaction";
    STATUS_DONE: string = "Done";

    COMMAND_LOGOUT: string = "logout";
    COMMAND_POPCHAT: string = "popchat";

    Product: ProductInfo;
    Products: Array<ProductInfo>;
    ProductDiscount: ProductInfo;
    ProductSelections: Array<ProductInfo>;

    Service: ServiceInfo;
    Services: Array<ServiceInfo>;
    ServiceToday: Array<ServiceInfo>;
    ServiceTodayCount: number;

    ServiceReservation: ReservationInfo;
    ServiceReservationUser: Array<ReservationInfo>;
    ServiceReservationNew: Array<ReservationInfo>;
    ServiceReservationActive: Array<ReservationInfo>;
    ServiceReservationDone: Array<ReservationInfo>;
    ServiceReservationUserHasItem: boolean = false;
    ServiceReservationStatuses: Array<string>;
    ServiceReservationTabIndex: number = 0;

    Transaction: TransactionInfo;
    Transactions: Array<TransactionInfo>;
    
    TransactionCancels: Array<CancelInfo>;
    TransactionCancelSelected: Array<CancelInfo>;

    SellInfos: Array<SellInfo>;
    SellInfosAmount: number = 0;
    SellInfosCount: number = 0;

    Delivery: DeliveryInfo;
    DeliveryInfos: Array<DeliveryInfo>;
    DeliveryStatuses: Array<string>;
    DeliveryStamp: number = 0;
    DeliveryToggledModule: string = null;

    ExpenseTypes: Array<string>;
    ExpensesToday: Array<ExpenseInfo>;
    ExpenseSelected: Array<ExpenseInfo>;
    ExpenseAmount: number = 0;

    Report: ReportInfo;
    Reports: Array<ReportInfo>;
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
    ShowCaseTodayCount: number; 

    ShowcaseOrder: OrderInfo;
    ShowcaseOrders: Array<OrderInfo>;
    ShowcaseUserOrders: Array<OrderInfo>;
    ShowcaseUserSelectingOrders: Array<OrderInfo>;

    ShowcaseUserDoneOrders: Array<OrderInfo>;
    ShowcaseUserHasOrder: boolean = false;
    ShowcaseUserHasOpenCart: boolean = false;
    ShowcaseOrderStatuses: Array<string>;
    ShowcaseOrderTabIndex: number = 0;

    Snapshot: SnapshotInfo;
    Snapshots: Array<SnapshotInfo>;

    Conversation: ConversationInfo;
    Conversations: Array<ConversationInfo>;
    Messages: Array<MessageInfo>;

    Months: Array<NameValue>;
    Date: Date;
    AccessTypes: Array<NameValue>;

    IsAuthenticating: boolean = false;
    IsSystemDataActiveLoaded: boolean = false;
    IsDataActiveLoaded: boolean = false;
    
    ShowLogin: boolean = true;
    SignupName: string;
    ViewWidth: number;

    DefaultImageURL: string;
    UploadingImageBasePath: string;
    CURRENCY: string;

    ModuleSetting: ModuleSettingInfo;
    SystemSetting: SystemSettingInfo;
    Modules: Array<NameValue>;
    PublicModules: Array<NameValue>;

    KeyDay: number;
    KeyMonth: number;
    KeyYear: number;

    constructor(private core: Core, private snackBar: MdSnackBar) {
        this.SetKeyDates();
        this.InitCollections();
        
        this.ReportYears = new Array<number>();
        for (let x = this.KeyYear - 5; x <= this.KeyYear; x++) {
            this.ReportYears.push(x);
        }

        this.Modules = [
            new NameValue("Home", "website-home"),
            new NameValue("Catalog", "website-catalog"),
            new NameValue("Sell", "product-sell"),
            new NameValue("Delivery", "delivery-list"),
            new NameValue("Order", "product-order"),
            new NameValue("Transaction", "transaction-list"),
            new NameValue("Balancing", "report-balancing")
        ];

        this.PublicModules = [
            new NameValue("Home", "website-home"),
            new NameValue("Catalog", "website-catalog")
        ];

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

        this.ShowcaseOrderStatuses = [
            this.STATUS_SELECTING,
            this.STATUS_REQUESTED,
            this.STATUS_IN_PROGRESS,
            this.STATUS_READY_PICKUP,
            this.STATUS_DELIVERY_CREATED,
            this.STATUS_FOR_DELIVERY,
            this.STATUS_DELIVERED,
            this.STATUS_CANCELLED,
            this.STATUS_DONE
        ];

        this.ServiceReservationStatuses = [
            this.STATUS_REQUESTED,
            this.STATUS_IN_PROGRESS,
            this.STATUS_CONFIRMED,
            this.STATUS_REJECTED,
            this.STATUS_DELAYED,
            this.STATUS_NOSHOW,
            this.STATUS_CANCELLED,
            this.STATUS_DONE
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

    public SetKeyDates() {
        this.Date = new Date();
        this.KeyDay = this.core.dateToKeyDay(this.Date);
        this.KeyMonth = this.core.dateToKeyMonth(this.Date);
        this.KeyYear = this.Date.getFullYear();
    }

    public InitCollections() {
        this.ShowcaseOrders = new Array<OrderInfo>();
        this.ShowcaseUserDoneOrders = new Array<OrderInfo>();
        this.ShowcaseUserSelectingOrders = new Array<OrderInfo>();
        this.ShowcaseUserOrders = new Array<OrderInfo>();

        this.ServiceReservationUser = new Array<ReservationInfo>();
        this.ServiceReservationActive = new Array<ReservationInfo>();
        this.ServiceReservationDone = new Array<ReservationInfo>();
        this.ServiceReservationNew = new Array<ReservationInfo>();
    }

    public SetSystemConfig() {
        this.SnackBarConfig.duration = this.SystemSetting.NotificationDuration;
        this.SnackBarConfigLong.duration = this.SystemSetting.NotificationSlowDuration;
        this.AccessDefault = this.SystemSetting.DefaultAccess;
        this.UserIsDefaultSystemUser = this.SystemSetting.DefaultIsSystemUser;
        this.DefaultImageURL = this.SystemSetting.DefaultImageURL;
        this.CURRENCY = this.SystemSetting.CurrencySymbol;
    }

    public Reset() {
        this.User = new UserInfo(this.DefaultImageURL);
        this.UserAccess = new AccessInfo();
        this.Messages = new Array<MessageInfo>();
        this.Conversations = new Array<ConversationInfo>();
        this.ShowcaseUserHasOrder = false;
        this.ShowcaseUserHasOpenCart = false;
        this.ServiceReservationUserHasItem = false;
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

    public HasMissingProfileData(): boolean {
        if(!this.ModuleSetting.PromptMissingProfileData)
            return false;

        if(!this.User.Address1 && !this.User.Address2)
            return true;

        if(!this.User.Contact1 && !this.User.Contact2)
            return true;

        return false;
    }

    public DeliveryUpdateStatus(item: DeliveryInfo, status: string) {
        item.Status = status;
        item.ActionLast = this.GetActionDate();
        let action = new NameValue(item.Status, item.ActionLast);
        item.Actions.push(action);
    }

    public DeliveryInjectStatus(item: DeliveryInfo, status: string) {
        let action = new NameValue(status, this.GetActionDate());
        item.Actions.push(action);
    }

    public OrderInjectStatus(item: OrderInfo, status: string) {
        let action = new NameValue(status, this.GetActionDate());
        item.Actions.push(action);
    }

    public OrderUpdateStatus(item: OrderInfo, status: string) {
        item.Status = status;
        item.ActionDate = this.GetActionDate();
        let action = new NameValue(item.Status, item.ActionDate);
        item.Actions.push(action);
    }

    public ReservationUpdateStatus(item: ReservationInfo, status: string) {
        item.Status = status;
        item.ActionDate = this.GetActionDate();
        let action = new NameValue(item.Status, item.ActionDate);
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

    public LoadFromMenu(name: string) {
        this.SOURCE = this.MENU;
        this.LoadComponent(name);
    }

    public LoadFromLink(name: string) {
        this.SOURCE = this.LINK;
        this.LoadComponent(name);
    }

    public LoadFromPublic(name: string) {
        this.SOURCE = this.PUBLIC;
        this.LoadComponent(name);
    }

    public LoadComponent(name: string) {
        this.ShowLogin = true;
        this.COMPONENT = name;
        this.core.loadComponent(name);
        this.GotoTop();
    }

    public LoadComponentsFromLink(names: Array<string>) {
        this.COMPONENT = "Multiple";
        this.SOURCE = this.LINK;
        this.core.loadComponents(names);
        this.GotoTop();
    }

    public GotoTop() {
        window.scroll(0, 0);
    }

    public SelectImage(basePath: string) {
        this.UploadingImageBasePath = basePath;
        this.core.selectImage();
    }

    public Display(message: string, action: string) {
        if(this.ModuleSetting.ModuleIsNotify) {
            this.snackBar.open(message, action, this.SnackBarConfig);
        }
    }

    public DisplayPublic(message: string, action: string) {
        if(this.ModuleSetting.PublicIsNotify) {
            this.snackBar.open(message, action, this.SnackBarConfig);
        }
    }

    public DisplayLong(message: string, action: string) {
        this.snackBar.open(message, action, this.SnackBarConfigLong);
    }
}