import { Injectable, ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Core } from './core';
import { ProductInfo, MemberInfo, SellInfo, TransactionInfo, ReportInfo, ExpenseInfo, NameValue, UserInfo, ShowcaseInfo, Access, CancelInfo } from './models';
import 'rxjs/add/operator/first';

@Injectable()
export class DataLayer {
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
    UserAccess: Access;

    Access: Access;
    Accesses: Array<Access>;

    Showcase: ShowcaseInfo;
    Showcases: Array<ShowcaseInfo>;
    ShowcaseToday: Array<ShowcaseInfo>;

    Months: Array<NameValue>;
    Date: Date = new Date();
    AccessTypes: Array<NameValue>;
    IsAuthenticating: boolean = false;

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
        this.UserAccess = new Access();
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
        window.scrollTo(0, 0);
    }

    LoadFromLink(name: string) {
        this.SOURCE = this.LINK;
        this.core.loadComponent(name);
        window.scrollTo(0, 0);
    }

    LoadComponentsFromLink(names: Array<string>) {
        this.SOURCE = this.LINK;
        this.core.loadComponents(names);
        window.scrollTo(0, 0);
    }
}

@Injectable()
export class DataAccess {
    PRODUCTS: string = "/products";
    MEMBERS: string = "/members";
    SELL_INFOS: string = "/sellInfos";
    TRANSACTIONS: string;
    REPORTS: string;
    EXPENSES: string;
    EXPENSE_TYPES: string = "/expenses/types";
    KEYDAY: string = "KeyDay";
    KEYMONTH: string = "KeyMonth";
    USERS: string = "/users";
    SHOWCASES: string = "/showcases";
    ACCESSES: string = "/accesses";
    CANCELS: string = "/cancels";
    StorageRef: firebase.storage.Reference = firebase.storage().ref();

    constructor(private core: Core, private DL: DataLayer, private af: AngularFireDatabase, private afAuth: AngularFireAuth) {
        this.TRANSACTIONS = "/transactions/" + this.DL.ReportToday.KeyYear + "/" + this.DL.ReportToday.KeyMonth;
        this.EXPENSES = "/expenses/" + this.DL.ReportToday.KeyYear + "/" + this.DL.ReportToday.KeyMonth;
        this.REPORTS = "/reports/" + this.DL.ReportToday.KeyYear;
    }

    public LogInWithFacebook() {
        this.afAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider());
    }

    public LogOut() {
        this.afAuth.auth.signOut();
        this.DL.UserAccess = new Access();
        this.DL.LoadFromMenu("home");
    }

    public DataLoad() {
        this.AccessLoad();
        this.UserLoad();
        this.MemberLoad();
        this.ShowcasesLoad();
        this.ExpensesTypeLoad();
        this.ReportTodayLoad();
        this.TransactionCancelCurrentLoad();
        this.ActiveDataLoad();
    }

    ActiveDataLoad() {
        this.af.list(this.PRODUCTS, { query: { orderByChild: 'Description' } }).subscribe(snapshots => {
            this.DL.Products = new Array<ProductInfo>();
            this.DL.ProductSelections = new Array<ProductInfo>();

            snapshots.forEach(snapshot => {
                let info: ProductInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Products.push(info);
                if (info.Quantity > 0)
                    this.DL.ProductSelections.push(info);
            });
        });

        this.af.list(this.SELL_INFOS).subscribe(snapshots => {
            this.DL.SellInfos = new Array<SellInfo>();
            this.DL.SellInfosAmount = 0;
            this.DL.SellInfosCount = 0;

            snapshots.forEach(snapshot => {
                let info: SellInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.SellInfos.push(info);

                this.DL.SellInfosCount += info.Quantity;
                this.DL.SellInfosAmount += info.Total;
            });
        });

        this.af.list(this.TRANSACTIONS, { query: { orderByChild: this.KEYDAY, equalTo: this.DL.ReportToday.KeyDay } }).subscribe(snapshots => {
            this.DL.TransactionsToday = new Array<TransactionInfo>();
            this.DL.ReportToday.Count = 0;
            this.DL.ReportToday.Amount = 0;

            snapshots.forEach(snapshot => {
                let info: TransactionInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.TransactionsToday.push(info);

                this.DL.ReportToday.Count += snapshot.Count;
                this.DL.ReportToday.Amount += snapshot.Amount;
            });
            this.DL.TransactionsToday.reverse();
        });

        this.af.list(this.EXPENSES, { query: { orderByChild: this.KEYDAY, equalTo: this.DL.ReportToday.KeyDay } }).subscribe(snapshots => {
            this.DL.ExpensesToday = new Array<ExpenseInfo>();
            this.DL.ReportToday.ExpenseAmount = 0;
            this.DL.ReportToday.ExpenseCount = 0;

            snapshots.forEach(snapshot => {
                this.DL.ExpensesToday.push(snapshot);

                this.DL.ReportToday.ExpenseCount++;
                this.DL.ReportToday.ExpenseAmount += snapshot.Amount;
            });
            this.DL.ExpensesToday.reverse();
        });
    }

    UserAuthenticate() {
        this.afAuth.authState.subscribe(user => {
            this.DL.User = new UserInfo();

            if (!user) {
                this.DL.User.Name = "GUEST";
                return;
            }

            this.DL.Users.forEach(u => {
                if (u.UID == user.uid)
                    this.DL.User = u;
            });

            // [temp] default to manager
            if (!this.DL.User.AccessKey) {
                this.DL.User.AccessKey = "-KsasLernU2_JWOO90Bz";
                this.DL.User.AccessName = "DEMO";
            }

            this.DL.User.Name = user.displayName;
            this.DL.User.ImageURL = user.photoURL;
            this.DL.User.UID = user.uid;
            this.DL.SetPermission();

            this.UserSave(this.DL.User);
            this.DL.LoadFromMenu("dashboard");
        });
    }

    MemberLoad() {
        this.af.list(this.MEMBERS, { query: { orderByChild: 'Name' }}).first().subscribe(snapshots => {
            this.DL.Members = new Array<MemberInfo>();
            this.DL.MemberSelections = new Array<MemberInfo>();

            snapshots.forEach(snapshot => {
                let info: MemberInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Members.push(info);
            });

            // add walk-in
            this.DL.MemberSelections.push(this.DL.MemberWalkIn);
            this.DL.MemberSelections = this.DL.MemberSelections.concat(this.DL.Members);
        });
    }

    UserLoad() {
        this.af.list(this.USERS, { query: { orderByChild: 'Name' }}).first().subscribe(snapshots => {
            this.DL.Users = new Array<UserInfo>();

            snapshots.forEach(snapshot => {
                let info: UserInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Users.push(info);
            });

            // single subscription
            if (!this.DL.IsAuthenticating) {
                this.DL.IsAuthenticating = true;
                this.UserAuthenticate();
            }
        });
    }

    ExpensesTypeLoad() {
        this.af.object(this.EXPENSE_TYPES).first().subscribe(snapshot => {
            if (snapshot.length)
                this.DL.ExpenseTypes = snapshot;
            else
                this.DL.ExpenseTypes = new Array<string>();
        });
    }

    TransactionCancelCurrentLoad() {
        this.af.list(this.CANCELS, { query: { orderByChild: this.KEYMONTH, equalTo: this.DL.ReportToday.KeyMonth }}).first().subscribe(snapshots => {
            this.DL.TransactionCancels = new Array<CancelInfo>();
            snapshots.forEach(snapshot => {
                let info: CancelInfo = snapshot;
                this.DL.TransactionCancels.push(info);
            });

            this.DL.TransactionCancels.reverse();
        });
    }

    TransactionCancelLoad(keyMonth: number) {
        if(this.DL.ReportToday.KeyMonth == keyMonth)
            this.DL.TransactionCancelSelected = this.DL.TransactionCancels;
        else {
            this.af.list(this.CANCELS, { query: { orderByChild: this.KEYMONTH, equalTo: keyMonth }}).first().subscribe(snapshots => {
                this.DL.TransactionCancelSelected = new Array<CancelInfo>();
                snapshots.forEach(snapshot => {
                    let info: CancelInfo = snapshot;
                    this.DL.TransactionCancelSelected.push(info);
                });

                this.DL.TransactionCancelSelected.reverse();
            });
        }
    }

    ShowcasesLoad() {
        this.af.list(this.SHOWCASES, { query: { orderByChild: 'Name' } }).first().subscribe(snapshots => {
            this.DL.Showcases = new Array<ShowcaseInfo>();
            this.DL.ShowcaseToday = new Array<ShowcaseInfo>();

            snapshots.forEach(snapshot => {
                let info: ShowcaseInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.Showcases.push(info);

                // get showcase for today
                let keyToday: number = this.core.dateToKeyDay(this.DL.Date);
                if (info.Schedules) {
                    let hasToday: boolean = false;
                    info.Schedules.forEach(item => {
                        if (item.From <= keyToday && item.To >= keyToday)
                            hasToday = true;
                    });

                    if (hasToday)
                        this.DL.ShowcaseToday.push(info);
                }
            });
        });
    }

    TransactionSelectedLoad(report: ReportInfo) {
        this.af.list("/transactions/" + report.KeyYear + "/" + report.KeyMonth, { query: { orderByChild: this.KEYDAY, equalTo: report.KeyDay } }).first().subscribe(snapshots => {
            this.DL.TransactionSelected = new Array<TransactionInfo>();
            this.DL.ReportSelected.Count = 0;
            this.DL.ReportSelected.Amount = 0;

            snapshots.forEach(snapshot => {
                let info: TransactionInfo = snapshot;
                info.key = snapshot.$key;
                this.DL.TransactionSelected.push(info);

                this.DL.ReportSelected.Count += snapshot.Count;
                this.DL.ReportSelected.Amount += snapshot.Amount;
            });

            this.DL.TransactionSelected.reverse();
        });
    }

    ReportMonthlyLoad(selectedYear: number, selectedMonth: number) {
        this.af.list("/reports/" + selectedYear, { query: { orderByChild: this.KEYMONTH, equalTo: parseInt(selectedYear + this.core.az(selectedMonth)) } }).first().subscribe(snapshots => {
            this.DL.Reports = new Array<ReportInfo>();
            this.DL.ReportSelected = new ReportInfo();
            this.DL.ReportSelected.Count = 0;
            this.DL.ReportSelected.Amount = 0;
            this.DL.ReportSelected.ExpenseCount = 0;
            this.DL.ReportSelected.ExpenseAmount = 0;

            snapshots.forEach(snapshot => {
                this.DL.Reports.push(snapshot);
                this.DL.ReportSelected.Count += snapshot.Count;
                this.DL.ReportSelected.Amount += snapshot.Amount;
                this.DL.ReportSelected.ExpenseCount += snapshot.ExpenseCount;
                this.DL.ReportSelected.ExpenseAmount += snapshot.ExpenseAmount;
            });

            this.DL.Reports.reverse();
        });
    }

    ExpenseSelectedLoad(report: ReportInfo) {
        this.af.list("/expenses/" + report.KeyYear + "/" + report.KeyMonth, { query: { orderByChild: this.KEYDAY, equalTo: report.KeyDay } }).subscribe(snapshots => {
            this.DL.ExpenseSelected = new Array<ExpenseInfo>();
            this.DL.ReportSelected.ExpenseAmount = 0;
            this.DL.ReportSelected.ExpenseCount = 0;

            snapshots.forEach(snapshot => {
                this.DL.ExpenseSelected.push(snapshot);
                this.DL.ReportSelected.ExpenseCount++;
                this.DL.ReportSelected.ExpenseAmount += snapshot.Amount;
            });

            this.DL.ExpenseSelected.reverse();
        });
    }

    ReportTodayLoad() {
        this.af.list(this.REPORTS, { query: { orderByChild: this.KEYDAY, equalTo: this.DL.ReportToday.KeyDay } }).first().subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                this.DL.ReportToday = snapshot;
                this.DL.ReportToday.key = snapshot.$key;
            });
        });
    }

    AccessLoad() {
        this.af.list(this.ACCESSES, { query: { orderByChild: 'Name' } }).first().subscribe(snapshots => {
            this.DL.Accesses = new Array<Access>();
            snapshots.forEach(snapshot => {
                let info: Access = snapshot;
                info.key = snapshot.$key;
                this.DL.Accesses.push(info);
            });
        });
    }

    public ProductSave(item: ProductInfo) {
        if (item.key)
            this.af.list(this.PRODUCTS).update(item.key, item);
        else
            this.af.list(this.PRODUCTS).push(item);
    }

    public ProductUpdateFromSellInfo() {
        let items = Array<ProductInfo>();

        // update in memory first to prevent data sync issue
        this.DL.SellInfos.forEach(sell => {
            this.DL.Products.forEach(product => {
                if (sell.Code == product.Code) {
                    product.Quantity -= sell.Quantity;
                    items.push(product);
                }
            });
        });

        // do the actual database update
        items.forEach(item => {
            this.ProductSave(item);
        });
    }

    public MemberSave(item: MemberInfo) {
        if (item.key)
            this.af.list(this.MEMBERS).update(item.key, item);
        else
            this.af.list(this.MEMBERS).push(item);
        this.MemberLoad();
    }

    public UserSave(item: UserInfo) {
        if (item.key)
            this.af.list(this.USERS).update(item.key, item);
        else
            this.af.list(this.USERS).push(item);
        this.UserLoad();
    }

    public ShowcaseSave(item: ShowcaseInfo) {
        if (item.key)
            this.af.list(this.SHOWCASES).update(item.key, item);
        else
            this.af.list(this.SHOWCASES).push(item);
        this.ShowcasesLoad();
    }

    public AccessSave(item: Access) {
        if (item.key)
            this.af.list(this.ACCESSES).update(item.key, item);
        else
            this.af.list(this.ACCESSES).push(item);
        this.AccessLoad();
    }

    public SellInfoSave(item: SellInfo) {
        this.af.list(this.SELL_INFOS).push(item);
    }

    public SellInfoDelete(item: SellInfo) {
        this.af.list(this.SELL_INFOS).remove(item.key);
    }

    public SellInfoClear() {
        this.af.list(this.SELL_INFOS).remove();
    }

    public SellInfoDone(menberKey: string, buyerName: string) {
        let info = new TransactionInfo();
        info.MemberKey = menberKey
        info.BuyerName = buyerName;
        info.Items = this.DL.SellInfos;
        info.Count = this.DL.SellInfosCount;
        info.Amount = this.DL.SellInfosAmount;
        info.ActionDate = this.core.dateToNumber(new Date());
        info.KeyDay = this.core.dateToKeyDay(this.DL.Date);

        this.TransactionInfoSave(info);
        this.ProductUpdateFromSellInfo();
        this.ReportTodaySave();
        this.SellInfoClear();
    }

    public TransactionSelectedCancel(description: string) {
        let items = Array<ProductInfo>();

        // update in memory first to prevent data sync issue
        this.DL.Transaction.Items.forEach(sell => {
            this.DL.Products.forEach(product => {
                if (sell.Code == product.Code) {
                    product.Quantity += sell.Quantity;
                    items.push(product);
                }
            });
        });

        // do the actual database update
        items.forEach(item => {
            this.ProductSave(item);
        });

        // save cancel info
        let info = new CancelInfo();
        info.Description = description;
        info.Amount = this.DL.Transaction.Amount;
        info.ActionDate = this.core.dateToNumber(new Date());
        info.KeyMonth = this.core.dateToKeyMonth(this.DL.Date);
        this.CancelInfoSave(info);

        // delete transaction
        this.TransactionInfoDelete(this.DL.ReportSelected, this.DL.Transaction.key);

        // report recompute
        this.ReportGenerate(this.DL.ReportSelected.KeyYear, this.DL.ReportSelected.KeyMonth, this.DL.ReportSelected.KeyDay);
    }

    public TransactionInfoSave(item: TransactionInfo) {
        this.af.list(this.TRANSACTIONS).push(item);
    }

    public CancelInfoSave(item: CancelInfo) {
        this.af.list(this.CANCELS).push(item);
        if(this.DL.ReportToday.KeyMonth == item.KeyMonth)
            this.TransactionCancelCurrentLoad();
        else
            this.TransactionCancelLoad(item.KeyMonth);
    }

    public TransactionInfoDelete(report: ReportInfo, key: string) {
        this.af.object("/transactions/" + report.KeyYear + "/" + report.KeyMonth + "/" + key).remove();
    }

    public ExpenseInfoSave(description: string, amount: number) {
        let info = new ExpenseInfo();
        info.Description = description;
        info.Amount = amount;
        info.ActionDate = this.core.dateToNumber(new Date());
        info.KeyDay = this.core.dateToKeyDay(this.DL.Date);
        this.af.list(this.EXPENSES).push(info);
        this.ReportTodaySave();

        // add record for auto complete
        if (this.DL.ExpenseTypes.indexOf(description) === -1) {
            this.DL.ExpenseTypes.push(description);
            this.DL.ExpenseTypes.sort();
            this.af.object(this.EXPENSE_TYPES).update(this.DL.ExpenseTypes);
            this.ExpensesTypeLoad();
        }
    }

    ReportGenerate(year: number, keyMonth: number, keyDay: number) {
        // get report for that day
        let report = new ReportInfo();
        report.KeyYear = year;
        report.KeyMonth = keyMonth;
        report.KeyDay = keyDay;

        let transaction = new TransactionInfo();
        let expense = new ExpenseInfo();

        this.af.list("/reports/" + year, { query: { orderByChild: this.KEYDAY, equalTo: keyDay } }).first().subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                report.key = snapshot.$key;
            });

            // get transactions
            this.af.list("/transactions/" + year + "/" + keyMonth, { query: { orderByChild: this.KEYDAY, equalTo: keyDay } }).first().subscribe(snapshots => {
                report.Count = 0;
                report.Amount = 0;

                snapshots.forEach(snapshot => {
                    report.Count += snapshot.Count;
                    report.Amount += snapshot.Amount;
                });

                // get expenses
                this.af.list("/expenses/" + year + "/" + keyMonth, { query: { orderByChild: this.KEYDAY, equalTo: keyDay } }).first().subscribe(snapshots => {
                    report.ExpenseAmount = 0;
                    report.ExpenseCount = 0;

                    snapshots.forEach(snapshot => {
                        report.ExpenseCount++;
                        report.ExpenseAmount += snapshot.Amount;
                    });

                    // save
                    if (report.key)
                        this.af.list("/reports/" + year).update(report.key, report);
                    else
                        this.af.list("/reports/" + year).push(report);

                    this.TransactionSelectedLoad(report);
                });
            });
        });
    }

    public ReportTodaySave() {
        if (this.DL.ReportToday.key)
            this.af.list(this.REPORTS).update(this.DL.ReportToday.key, this.DL.ReportToday);
        else
            this.af.list(this.REPORTS).push(this.DL.ReportToday);
        this.ReportTodayLoad();
    }
}