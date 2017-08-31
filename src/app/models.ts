export class ProductInfo {
    key: string;
    Code: string;
    Description: string;
    BuyPrice: number;
    SellPrice: number;
    Quantity: number;
    QuantityNotify: number;
}

export class MemberInfo {
    key: string;
    Name: string;
    Address1: string;
    Address2: string;
    Contact1: string;
    Contact2: string;
    JoinDate: number;
}

export class SellInfo {
    key: string;
    Code: string;
    Description: string;
    Quantity: number;
    Price: number;
    Total: number;
}

export class TransactionInfo {
    key: string;
    MemberKey: string;
    BuyerName: string;
    Items: Array<SellInfo>;
    Count: number;
    Amount: number;
    ActionDate: number;
    KeyDay: number;
}

export class ReportInfo {
    key: string;
    KeyDay: number;
    KeyMonth: number;
    KeyYear: number;
    SaleCount: number;
    SaleAmount: number;
    ExpenseAmount: number;
    ExpenseCount: number;
    COHStarting: number;
    COHComputed: number;
    COHActual: number;
}

export class ExpenseInfo {
    Description: string;
    Amount: number;
    ActionDate: number;
    KeyDay: number;
}

export class UserInfo {
    key: string;
    Name: string;
    UID: string;
    ImageURL: string;
    AccessKey: string;
    AccessName: string;
}

export class ShowcaseInfo {
    key: string;
    Code: string;
    Name: string;
    Description: string;
    Price: number;
    ImageURL: string;
    Schedules: Array<ScheduleInfo>;

    constructor() {
        this.Schedules = new Array<ScheduleInfo>();
        this.ImageURL = "https://firebasestorage.googleapis.com/v0/b/temp-system.appspot.com/o/images%2FNoImage.png?alt=media&token=40823113-df0a-4412-8026-d501036b9d78";
    }
}

export class Access {
    key: string;
    Name: string;
    Description: string;
    
    AccessView: boolean;
    AccessAdd: boolean;
    AccessEdit: boolean;

    ExpenseView: boolean;
    ExpenseAdd: boolean;
    ExpenseSearch: boolean;

    MemberView: boolean;
    MemberAdd: boolean;
    MemberEdit: boolean;

    ProductView: boolean;
    ProductAdd: boolean;
    ProductEdit: boolean;
    ProductIn: boolean;
    ProductCancel: boolean;
    ProductCancelView: boolean;

    ReportView: boolean;
    ReportSearch: boolean;

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

    UserView: boolean;
    UserEdit: boolean;
}

export class ScheduleInfo {
    From: number;
    To: number;
}

export class NameValue {
    Name: string;
    Value: any;

    constructor(name: string, value: any){
        this.Name = name;
        this.Value = value;
    }
}

export class CancelInfo {
    Description: string;
    Amount: number;
    ActionDate: number;
    KeyMonth: number;
}