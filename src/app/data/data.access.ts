import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Core } from './../core';
import { DataLayer } from './data.layer';

import { AccessDAL } from './dal/AccessDAL';
import { ExpenseDAL } from './dal/ExpenseDAL';
import { ProductDAL } from './dal/ProductDAL';
import { ShowcaseDAL } from './dal/ShowcaseDAL';
import { ReportDAL } from './dal/ReportDAL';
import { CancelDAL } from './dal/CancelDAL';
import { TransactionDAL } from './dal/TransactionDAL';
import { SettingDAL } from './dal/SettingDAL';
import { SnapshotDAL } from './dal/SnapshotDAL';

import 'rxjs/add/operator/first';
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
export class DataAccess {
    expenseDAL: ExpenseDAL;
    productDAL: ProductDAL;
    accessDAL: AccessDAL;
    showcaseDAL: ShowcaseDAL;
    reportDAL: ReportDAL;
    cancelDAL: CancelDAL;
    transactionDAL: TransactionDAL;
    settingDAL: SettingDAL;
    snapshotDAL: SnapshotDAL;
    
    USERS: string = "/users";
    SETTING: string = "/setting";
    StorageRef: firebase.storage.Reference = firebase.storage().ref();

    constructor(private core: Core, private DL: DataLayer, private af: AngularFireDatabase, private afAuth: AngularFireAuth) {
        this.expenseDAL = new ExpenseDAL(core, DL, af);
        this.showcaseDAL = new ShowcaseDAL(core, DL, af);
        this.reportDAL = new ReportDAL(core, DL, this, af);
        this.cancelDAL = new CancelDAL(core, DL, this, af);
        this.transactionDAL = new TransactionDAL(core, DL, this, af);
        this.settingDAL = new SettingDAL(DL, af);
        this.accessDAL = new AccessDAL(DL, af);
        this.productDAL = new ProductDAL(DL, af);
        this.snapshotDAL = new SnapshotDAL(DL, af);
    }

    public LogInWithFacebook() {
        this.afAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider());
    }

    public LogOut() {
        this.DL.UserAccess = new AccessInfo();
        this.DL.LoadFromMenu("dashboard-home");
        this.afAuth.auth.signOut();
    }

    public Signup(email: string, password: string) {
        this.afAuth.auth
        .createUserWithEmailAndPassword(email, password)
        .then(value => {
            this.DL.Display("Account", "Created!");
        })
        .catch(err => {
            console.log(err);
            this.DL.Display("Account", "Create account failed.");
        });  
    }

    public LogIn(email: string, password: string) {
        this.afAuth.auth
        .signInWithEmailAndPassword(email, password)
        .then(value => {
            this.DL.Display("Login", "Successful!");
        })
        .catch(err => {
            console.log(err);
            this.DL.Display("Login", "Login failed.");
        });
    }

    public DataLoad() {
        this.accessDAL.Load();
        this.settingDAL.SystemLoad();
        this.settingDAL.ModuleLoad();
        this.UserLoad();
        this.showcaseDAL.Load();
    }

    public DataSystemLoad() {
        this.expenseDAL.LoadTypes();
        this.reportDAL.Load();
        this.cancelDAL.Load();
        this.ActiveDataLoad();
    }

    ActiveDataLoad() {
        if(!this.DL.IsDataActiveLoaded) {
            this.productDAL.Load();
            this.transactionDAL.Load();
            this.transactionDAL.LoadSell();
            this.transactionDAL.LoadDelivery();
            this.expenseDAL.Load();
            this.DL.IsDataActiveLoaded = true;
        }
    }

    UserAuthenticate() {
        this.afAuth.authState.subscribe(user => {
            this.DL.User = new UserInfo(this.DL.DefaultImageURL);

            if (!user) {
                this.DL.User.Name = "GUEST";
                return;
            }

            let toSave = false;

            this.DL.UserAll.forEach(u => {
                if (u.UID == user.uid)
                    this.DL.User = u;
            });

            // default to system config
            if (!this.DL.User.AccessKey) {
                this.DL.User.AccessKey = this.DL.AccessDefault;
                this.DL.User.AccessName = "Default";
                this.DL.User.IsSystemUser = this.DL.UserIsDefaultSystemUser;
                this.DL.User.IsMember = true
                this.DL.User.JoinDate = this.core.dateToNumber(this.DL.Date);

                this.DL.User.Name = user.displayName;
                this.DL.User.Email = user.email;

                if(!this.DL.User.Name)
                    this.DL.User.Name = this.DL.User.Email;

                this.DL.User.UID = user.uid;
                this.DL.User.ImageURL = user.photoURL
                toSave = true;
            }

            // update system record
            if(user.photoURL && this.DL.User.ImageURL != user.photoURL) {
                this.DL.User.ImageURL = user.photoURL;
                toSave = true;
            }

            if(!this.DL.User.ImageURL) {
                this.DL.User.ImageURL = this.DL.DefaultImageURL;
                toSave = true;
            }
            
            if(this.DL.User.Email != user.email){
                this.DL.User.Email = user.email;
                toSave = true;
            }

            if((!this.DL.User.SystemImageURL || this.DL.User.SystemImageURL == this.DL.DefaultImageURL) && user.photoURL) {
                this.DL.User.SystemImageURL = user.photoURL;
                toSave = true;
            }

            if(toSave)
                this.UserSave(this.DL.User);
            
            if(this.DL.User.IsSystemUser) {
                this.DataSystemLoad();
                this.DL.SetPermission();
                this.DL.LoadFromMenu("report-list");
            }
            else 
                this.DL.LoadFromMenu("dashboard-home");
        });
    }

    UserLoad() {
        this.af.list(this.USERS, { query: { orderByChild: 'Name' }}).first().subscribe(snapshots => {
            this.DL.Users = new Array<UserInfo>();
            this.DL.UserAll = new Array<UserInfo>();
            this.DL.UserSelections = new Array<UserInfo>();

            this.DL.Members = new Array<UserInfo>();
            this.DL.MemberSelections = new Array<UserInfo>();

            snapshots.forEach(snapshot => {
                let info: UserInfo = snapshot;
                info.key = snapshot.$key;

                if(info.IsSystemUser)
                    this.DL.Users.push(info);
                
                if(info.IsMember)
                    this.DL.Members.push(info);

                this.DL.UserAll.push(info);
            });

            // add walk-in for members
            this.DL.MemberSelections.push(this.DL.MemberWalkIn);
            this.DL.MemberSelections = this.DL.MemberSelections.concat(this.DL.Members);

            // add pending for users
            this.DL.UserSelections.push(this.DL.UserPending);
            this.DL.UserSelections = this.DL.UserSelections.concat(this.DL.Users);

            // single subscription
            if (!this.DL.IsAuthenticating) {
                this.DL.IsAuthenticating = true;
                this.UserAuthenticate();
            }
        });
    }

    ModuleSettingLoad() {
        this.settingDAL.ModuleLoad();
    }

    TransactionCancelCurrentLoad() {
        this.cancelDAL.Load();
    }

    TransactionCancelLoad(keyMonth: number) {
        this.cancelDAL.LoadByKeyMonth(keyMonth);
    }

    SnapshotLoad(keyDay: number) {
        this.snapshotDAL.Load(keyDay);
    }

    ShowcasesLoad() {
        this.showcaseDAL.Load();
    }

    TransactionSelectedLoad(report: ReportInfo) {
        this.transactionDAL.LoadByReportInfo(report);
    }

    ReportMonthlyLoad(selectedYear: number, selectedMonth: number) {
        this.reportDAL.LoadByYearAndMonth(selectedYear, selectedMonth);
    }

    public ReportReGenerate(year: number, keyMonth: number, keyDay: number) {
        this.reportDAL.ReGenerate(year, keyMonth, keyDay);
    }

    ExpenseSelectedLoad(report: ReportInfo) {
        this.expenseDAL.LoadByReport(report);
    }

    AccessLoad() {
        this.accessDAL.Load();
    }

    public ProductSave(item: ProductInfo) {
        this.productDAL.Save(item);
    }

    public UserSave(item: UserInfo) {
        if (item.key)
            this.af.list(this.USERS).update(item.key, item);
        else
            this.af.list(this.USERS).push(item);
        this.UserLoad();
    }

    public ShowcaseSave(item: ShowcaseInfo) {
        this.showcaseDAL.Save(item);
        this.showcaseDAL.Load();
    }

    public AccessSave(item: AccessInfo) {
        this.accessDAL.Save(item);
        this.accessDAL.Load();
    }

    public SellInfoSave(item: SellInfo) {
        this.transactionDAL.SellSave(item);
    }

    public SnapshotSave(item: SnapshotInfo) {
        this.snapshotDAL.Save(item);
        this.snapshotDAL.Load(this.DL.ReportToday.KeyDay);
    }

    public SellInfoDelete(item: SellInfo) {
        this.transactionDAL.SellDelete(item);
    }

    public SellInfoClear() {
        this.transactionDAL.SellClear();
    }

    public SellInfoDone(memberKey: string, buyerName: string, isDelivery: boolean) {
        this.transactionDAL.SellDone(memberKey, buyerName, isDelivery);
    }

    public DeliverySave(item: DeliveryInfo) {
        this.transactionDAL.DeliverySave(item);
    }

    public DeliveryDelete(item: DeliveryInfo) {
        this.transactionDAL.DeliveryDelete(item);
    }

    public ProductUpdate(infos: Array<SellInfo>) {
        this.productDAL.UpdateProducts(infos);
    }

    public TransactionSelectedCancel(description: string) {
        this.cancelDAL.CancelSelected(description);
    }

    public TransactionInfoSave(item: TransactionInfo) {
        this.transactionDAL.Save(item);
    }

    public CancelInfoSave(item: CancelInfo) {
        this.cancelDAL.Save(item);
    }

    public ExpenseInfoSave(item: ExpenseInfo) {
        this.expenseDAL.Save(item);

        if(item.KeyDay == this.DL.ReportToday.KeyDay)
            this.ReportTodaySave();
        else
            this.ReportReGenerateBySelected()
    }

    public ExpenseDelete(item: ExpenseInfo) {
        this.expenseDAL.Delete(item);
        
        if(item.KeyDay == this.DL.ReportToday.KeyDay)
            this.ReportTodaySave();
        else
            this.ReportReGenerateBySelected()
    }

    public ReportTodaySave() {
        let date = new Date();
        if(this.DL.Date.getDate() != date.getDate()) {
            this.DL.Date = date;
            this.DL.ReportTodayRefresh();
        }

        this.reportDAL.SaveTodayReport();
    }
    
    public ReportSave(item: ReportInfo) {
        this.reportDAL.Save(item);
    }

    public ReportReGenerateBySelected() {
        this.ReportReGenerate(this.DL.ReportSelected.KeyYear, this.DL.ReportSelected.KeyMonth, this.DL.ReportSelected.KeyDay);
    }

    public ModuleSettingSave(item: ModuleSettingInfo)
    {
        this.settingDAL.ModuleSave(item);
    }

    public SystemSettingSave(item: SystemSettingInfo)
    {
        this.settingDAL.SystemSave(item);
    }
}