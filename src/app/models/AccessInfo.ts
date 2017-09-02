export class AccessInfo {
    key: string;
    Name: string;
    Description: string;
    
    AccessView: boolean;
    AccessAdd: boolean;
    AccessEdit: boolean;

    ExpenseView: boolean;
    ExpenseAdd: boolean;
    ExpenseSearch: boolean;

    ProductView: boolean;
    ProductAdd: boolean;
    ProductEdit: boolean;
    ProductIn: boolean;
    ProductCancel: boolean;
    ProductCancelView: boolean;

    ReportView: boolean;
    ReportSearch: boolean;
    ReportBalanceView: boolean;
    ReportBalanceStartEdit: boolean;
    ReportBalanceActualEdit: boolean;
    ReportBalanceSummaryView: boolean;

    SellView: boolean;
    SellAdd: boolean;
    SellDelete: boolean;

    ShowcaseView: boolean;
    ShowcaseAdd: boolean;
    ShowcaseEdit: boolean;
    ShowcaseScheduleView: boolean;
    ShowcaseScheduleAdd: boolean;
    ShowcaseScheduleDelete: boolean;

    TransactionView: boolean;
    TransactionDetail: boolean;
    TransactionSearch: boolean;

    DeliveryView: boolean;

    UserView: boolean;
    UserEdit: boolean;
    UserAccessEdit: boolean;
    UserGroupEdit: boolean;

    MemberView: boolean;
    MemberAdd: boolean;
    MemberEdit: boolean;
}