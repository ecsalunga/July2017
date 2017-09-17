export class AccessInfo {
    key: string;
    Name: string;
    Description: string;
    ModuleStart: string;
    CanLogout: string;
    
    AccessView: boolean;
    AccessAdd: boolean;
    AccessEdit: boolean;

    ExpenseView: boolean;
    ExpenseAdd: boolean;
    ExpenseDelete: boolean;
    ExpenseSearch: boolean;

    ProductView: boolean;
    ProductAdd: boolean;
    ProductEdit: boolean;
    ProductIn: boolean;
    ProductCancel: boolean;
    ProductCancelView: boolean;

    ServiceView: boolean;
    ServiceAdd: boolean;
    ServiceEdit: boolean;
    ServiceScheduleView: boolean;
    ServiceScheduleAdd: boolean;
    ServiceScheduleDelete: boolean; 

    ReportView: boolean;
    ReportSearch: boolean;
    ReportBalanceView: boolean;
    ReportBalanceStartEdit: boolean;
    ReportBalanceActualEdit: boolean;
    ReportRegenerate: boolean;
    ReportBalanceSummaryView: boolean;

    SellView: boolean;
    SellAdd: boolean;
    SellDelete: boolean;
    SellDiscount: boolean;

    ShowcaseView: boolean;
    ShowcaseAdd: boolean;
    ShowcaseEdit: boolean;
    ShowcaseScheduleView: boolean;
    ShowcaseScheduleAdd: boolean;
    ShowcaseScheduleDelete: boolean; 

    ShowcaseOrderView: boolean;
    ShowcaseOrderEdit: boolean;
    ShowcaseOrderDelete: boolean;

    TransactionView: boolean;
    TransactionDetail: boolean;
    TransactionSearch: boolean;

    DeliveryView: boolean;
    DeliveryDoneView: boolean;
    DeliveryEdit: boolean;
    DeliveryDelete: boolean; 

    UserView: boolean;
    UserEdit: boolean;
    UserCommandLogout: boolean;
    UserProfileEdit: boolean;
    UserAccessEdit: boolean;
    UserGroupEdit: boolean;

    MemberView: boolean;
    MemberAdd: boolean;
    MemberEdit: boolean;

    ModuleSettingView: boolean;
    ModuleSettingEdit: boolean;

    SystemSettingView: boolean; 
    SystemSettingEdit: boolean;

    SnapshotView: boolean;
    SnapshotAdd: boolean;
    SnapshotReview: boolean;

    MessageView: boolean;
    MessageManage: boolean;
    MessagePop: boolean;
}