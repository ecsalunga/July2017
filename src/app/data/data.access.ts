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
    ModuleSettingInfo
} from './../models';

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
    
    USERS: string = "/users";
    SETTING: string = "/setting";
    StorageRef: firebase.storage.Reference = firebase.storage().ref();

    constructor(private core: Core, private DL: DataLayer, private af: AngularFireDatabase, private afAuth: AngularFireAuth) {
        this.expenseDAL = new ExpenseDAL(core, DL, af);
        this.showcaseDAL = new ShowcaseDAL(core, DL, af);
        this.reportDAL = new ReportDAL(core, DL, af);
        this.cancelDAL = new CancelDAL(core, DL, this, af);
        this.transactionDAL = new TransactionDAL(core, DL, this, af);
        this.settingDAL = new SettingDAL(DL, af);
        this.accessDAL = new AccessDAL(DL, af);
        this.productDAL = new ProductDAL(DL, af);
    }

    public LogInWithFacebook() {
        this.afAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider());
    }

    public LogOut() {
        this.DL.UserAccess = new AccessInfo();
        this.DL.LoadFromMenu("dashboard-home");
        this.afAuth.auth.signOut();
    }

    public DataLoad() {
        this.accessDAL.Load();
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
            this.DL.User = new UserInfo();

            if (!user) {
                this.DL.User.Name = "GUEST";
                return;
            }

            this.DL.UserAll.forEach(u => {
                if (u.UID == user.uid)
                    this.DL.User = u;
            });

            // [temp] default to manager
            if (!this.DL.User.AccessKey) {
                this.DL.User.AccessKey = "-KsasLernU2_JWOO90Bz";
                this.DL.User.AccessName = "DEMO";
                this.DL.User.IsSystemUser = true;
                this.DL.User.IsMember = true
                this.DL.User.JoinDate = this.core.dateToNumber(this.DL.Date);
            }

            this.DL.User.Name = user.displayName;
            this.DL.User.ImageURL = user.photoURL;
            this.DL.User.UID = user.uid;
    
            if(this.DL.User.IsSystemUser)
                this.DataSystemLoad();

            this.DL.SetPermission();
            this.UserSave(this.DL.User);
            this.DL.LoadFromMenu("report-list");
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

    ShowcasesLoad() {
        this.showcaseDAL.Load();
    }

    TransactionSelectedLoad(report: ReportInfo) {
        this.transactionDAL.LoadByReportInfo(report);
    }

    ReportMonthlyLoad(selectedYear: number, selectedMonth: number) {
        this.reportDAL.LoadByYearAndMonth(selectedYear, selectedMonth);
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

    public ExpenseInfoSave(description: string, amount: number) {
        this.expenseDAL.Save(description, amount);
        this.ReportTodaySave();
    }

    public ReportTodaySave() {
        this.reportDAL.SaveTodayReport();
    }
    
    public ReportSave(item: ReportInfo) {
        this.reportDAL.Save(item);
    }

    public ModuleSettingSave(item: ModuleSettingInfo)
    {
        this.settingDAL.ModuleSave(item);
    }
}