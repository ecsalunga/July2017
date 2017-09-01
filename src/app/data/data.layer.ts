import { Injectable } from '@angular/core';
import { Core } from './../core';
import { 
    ProductInfo, 
    MemberInfo, 
    SellInfo, 
    TransactionInfo, 
    ReportInfo, 
    ExpenseInfo, 
    NameValue, 
    UserInfo, 
    ShowcaseInfo, 
    AccessInfo, 
    CancelInfo
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

    Product: ProductInfo;
    Products: Array<ProductInfo>;
    ProductSelections: Array<ProductInfo>;

    Member: MemberInfo;
    Members: Array<MemberInfo>;
    MemberSelections: Array<MemberInfo>;
    MemberWalkIn: MemberInfo;

    Transaction: TransactionInfo;
    TransactionsToday: Array<TransactionInfo>;
    TransactionSelected: Array<TransactionInfo>;
    TransactionCancels: Array<CancelInfo>;
    TransactionCancelSelected: Array<CancelInfo>;

    SellInfos: Array<SellInfo>;
    SellInfosAmount: number = 0;
    SellInfosCount: number = 0;

    ExpenseTypes: Array<string>;
    ExpensesToday: Array<ExpenseInfo>;
    ExpenseSelected: Array<ExpenseInfo>;
    ExpenseAmount: number = 0;

    Reports: Array<ReportInfo>;
    ReportToday: ReportInfo;
    ReportSelected: ReportInfo;
    ReportYears: Array<number>;

    User: UserInfo;
    Users: Array<UserInfo>;
    UserAccess: AccessInfo;

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

    constructor(private core: Core) {
        this.ReportToday = new ReportInfo();
        this.ReportSelected = new ReportInfo();
        this.ReportYears = new Array<number>();

        this.ReportToday.KeyDay = this.core.dateToKeyDay(this.Date);
        this.ReportToday.KeyMonth = this.core.dateToKeyMonth(this.Date);
        this.ReportToday.KeyYear = this.Date.getFullYear();
        this.ReportSelected = this.ReportToday;

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

        for (let x = this.ReportToday.KeyYear - 5; x <= this.ReportToday.KeyYear; x++) {
            this.ReportYears.push(x);
        }

        this.MemberWalkIn = new MemberInfo();
        this.MemberWalkIn.Name = "Walk-In";
        this.MemberWalkIn.key = "Walk-In";

        this.User = new UserInfo();
        this.UserAccess = new AccessInfo();
    }

    public SetPermission() {
        if (this.User && this.Accesses) {
            this.Accesses.forEach(access => {
                if (this.User.AccessKey == access.key)
                    this.UserAccess = access;
            });
        }
    }

    LoadFromMenu(name: string) {
        this.SOURCE = this.MENU;
        this.core.loadComponent(name);
        this.MainContent.scrollTop = 0;
    }

    LoadFromLink(name: string) {
        this.SOURCE = this.LINK;
        this.core.loadComponent(name);
        this.MainContent.scrollTop = 0;
    }

    LoadComponentsFromLink(names: Array<string>) {
        this.SOURCE = this.LINK;
        this.core.loadComponents(names);
        this.MainContent.scrollTop = 0;
    }
}