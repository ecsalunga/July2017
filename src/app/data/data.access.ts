import { Injectable, EventEmitter } from '@angular/core';
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
import { ServiceDAL } from './dal/ServiceDAL';
import { MessageDAL } from './dal/MessageDAL';
import { SubscriptionDAL } from './dal/SubscriptionDAL';
import { ArticleDAL } from './dal/ArticleDAL';
import { GalleryDAL } from './dal/GalleryDAL';

import { MdDialog } from '@angular/material';
import { MessagePopupComponent } from '../message/popup/message-popup.component';

import 'rxjs/add/operator/first';
import {
    ProductInfo, SellInfo, TransactionInfo,
    ReportInfo, ExpenseInfo, NameValue,
    UserInfo, ShowcaseInfo, AccessInfo,
    CancelInfo, DeliveryInfo, ModuleSettingInfo,
    SystemSettingInfo, SnapshotInfo, OrderInfo,
    ServiceInfo, CommandInfo, ConversationInfo,
    MessageInfo, ReservationInfo, SubscriptionInfo,
    QuotaInfo, ArticleInfo, GalleryInfo,
    GalleryPhotoInfo
} from './models';

@Injectable()
export class DataAccess {
    DataLoaded: EventEmitter<string> = new EventEmitter();
    ImageUploaded: EventEmitter<string> = new EventEmitter();
    DataChecked: EventEmitter<boolean> = new EventEmitter();

    expenseDAL: ExpenseDAL;
    productDAL: ProductDAL;
    accessDAL: AccessDAL;
    showcaseDAL: ShowcaseDAL;
    reportDAL: ReportDAL;
    cancelDAL: CancelDAL;
    transactionDAL: TransactionDAL;
    settingDAL: SettingDAL;
    snapshotDAL: SnapshotDAL;
    serviceDAL: ServiceDAL;
    messageDAL: MessageDAL;
    subscriptionDAL: SubscriptionDAL;
    articleDAL: ArticleDAL;
    galleryDAL: GalleryDAL;

    USERS: string = "/users";
    SETTING: string = "/setting";
    COMMAND: string = "/commands";
    StorageRef: firebase.storage.Reference = firebase.storage().ref();

    constructor(private core: Core, private DL: DataLayer, private af: AngularFireDatabase, private afAuth: AngularFireAuth, private dialog: MdDialog) {
        this.expenseDAL = new ExpenseDAL(core, DL, this, af);
        this.reportDAL = new ReportDAL(core, DL, this, af);
        this.cancelDAL = new CancelDAL(core, DL, this, af);
        this.transactionDAL = new TransactionDAL(core, DL, this, af);
        this.messageDAL = new MessageDAL(DL, this, af);

        this.showcaseDAL = new ShowcaseDAL(core, DL, af);
        this.serviceDAL = new ServiceDAL(core, DL, af);
        this.settingDAL = new SettingDAL(DL, af);
        this.accessDAL = new AccessDAL(DL, af);
        this.productDAL = new ProductDAL(DL, af);
        this.snapshotDAL = new SnapshotDAL(DL, af);
        this.subscriptionDAL = new SubscriptionDAL(core, DL, af);
        this.articleDAL = new ArticleDAL(DL, af);
        this.galleryDAL = new GalleryDAL(DL, af);

        this.DataLoaded.subscribe(data => {
            if(data == this.DL.DATA_MESSAGE && !this.DL.IsCommandLoaded) {
                this.CommandLoad();
                this.DL.IsCommandLoaded = true;
            } 
        });
    }

    public LogInWithFacebook() {
        this.afAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider());
    }

    public LogOut() {
        this.DL.Reset();
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
            .catch(err => {
                console.log(err);
                this.DL.Display("Login", "Login failed.");
        });
    }

    public DataLoad() {
        this.accessDAL.Load();
        this.articleDAL.Load();
        this.settingDAL.SystemLoad();
        this.settingDAL.ModuleLoad();
        this.showcaseDAL.Load();
        this.subscriptionDAL.Load();
        this.serviceDAL.Load();
        this.galleryDAL.Load();
        this.galleryDAL.LoadPhotos();
        this.UserLoad();
    }

    public DataSystemLoad() {
        this.expenseDAL.LoadTypes();
        this.subscriptionDAL.LoadQuota();
        this.SystemActiveDataLoad();
    }

    public CommandLoad() {
        this.af.list(this.COMMAND).subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                let info: CommandInfo = snapshot;
                info.key = snapshot.$key;

                if (this.DL.User.key == info.UserKey)
                    this.CommandExecute(info);
            });
        });
    }

    public CommandExecute(item: CommandInfo) {
        if (item.ComandType == this.DL.COMMAND_LOGOUT) {
            this.DL.DisplayLong("Logout Command", "Executed!");
            this.LogOut();
        } else if (item.ComandType == this.DL.COMMAND_POPCHAT) {
            this.PopChat(item.Data);
        }

        this.CommandDelete(item.UserKey);
    }

    public PopChat(conversationKey: string) {
        this.DL.Conversations.forEach(item => {
            if (item.key == conversationKey) {
                this.DL.Conversation = item;

                let dialogRef = this.dialog.open(MessagePopupComponent, {
                    width: '300px',
                    data: { DA: this, DL: this.DL }
                });
            }
        });
    }

    public ShowUserInfo(key: string) {
        this.DL.UserAll.forEach(user => {
            if(user.key == key) {
                this.DL.UserShowInfo = user;
                this.DataLoaded.emit(this.DL.DATA_INFO);
            }
        })
    }

    public LoadGallery(item: GalleryInfo) {
        this.DL.SetGalleryPhotos(item);
        if(this.DL.GallerySelectedPhotos.length > 0)
        this.DataLoaded.emit(this.DL.DATA_GALLERY);
    }

    public CommandSave(item: CommandInfo) {
        this.af.list(this.COMMAND, { query: { orderByChild: 'UserKey', equalTo: item.UserKey } }).first().subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                this.af.list(this.COMMAND).remove(snapshot.$key);
            });
            this.af.list(this.COMMAND).push(item);
        });
    }

    public CommandDelete(userKey: string) {
        this.af.list(this.COMMAND, { query: { orderByChild: 'UserKey', equalTo: userKey } }).first().subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                this.af.list(this.COMMAND).remove(snapshot.$key);
            });
        });
    }

    SystemActiveDataLoad() {
        if (!this.DL.IsSystemDataActiveLoaded) {
            this.productDAL.Load();
            this.transactionDAL.LoadDelivery();
            this.DL.IsSystemDataActiveLoaded = true;
        }
    }

    GeneralActiveDataLoad() {
        if (!this.DL.IsDataActiveLoaded) {
            this.showcaseDAL.LoadOrder();
            this.serviceDAL.LoadReservation();
            this.messageDAL.Load();
            this.DL.IsDataActiveLoaded = true
        }
    }

    UserAuthenticate() {
        this.afAuth.authState.subscribe(user => {
            this.DL.User = new UserInfo(this.DL.DefaultImageURL);

            if (!user) {
                this.DL.User.Name = "GUEST";
                this.DL.LoadFromMenu(this.DL.ModuleSetting.DefaultPage);
                return;
            }

            this.DL.UserAll.forEach(u => {
                if (user.uid == u.UID || user.email == u.Email)
                    this.DL.User = u;
            });

            // default to system config
            if (!this.DL.User.AccessKey) {
                this.DL.User.AccessKey = this.DL.AccessDefault;
                this.DL.User.AccessName = "Default";
                this.DL.User.IsSystemUser = this.DL.UserIsDefaultSystemUser;
                this.DL.User.IsMember = true
                this.DL.User.JoinDate = this.DL.GetActionDate();

                this.DL.User.Name = user.displayName;
                this.DL.User.Email = user.email;

                if (!this.DL.User.Name) {
                    if (!this.DL.SignupName)
                        this.DL.User.Name = this.DL.User.Email;
                    else {
                        this.DL.User.Name = this.DL.SignupName;
                        this.DL.SignupName = null;
                    }
                }

                this.DL.User.UID = user.uid;
                this.DL.User.ImageURL = user.photoURL
            }

            // update system record
            if (user.photoURL && this.DL.User.ImageURL != user.photoURL)
                this.DL.User.ImageURL = user.photoURL;

            if (!this.DL.User.ImageURL)
                this.DL.User.ImageURL = this.DL.DefaultImageURL;

            if (this.DL.User.Email != user.email)
                this.DL.User.Email = user.email;

            if ((!this.DL.User.SystemImageURL || this.DL.User.SystemImageURL == this.DL.DefaultImageURL) && user.photoURL)
                this.DL.User.SystemImageURL = user.photoURL;

            // update action date
            this.DL.User.ActionDate = this.DL.GetActionDate();
            this.UserSave(this.DL.User);

            if (this.DL.User.IsMember || this.DL.User.IsSystemUser) {
                this.GeneralActiveDataLoad();
                this.DL.SetPermission();
            }

            if (this.DL.User.IsSystemUser) {
                this.DataSystemLoad();
                this.DL.LoadFromMenu(this.DL.UserAccess.ModuleStart);
            }
            else
                this.DL.LoadFromMenu(this.DL.ModuleSetting.DefaultPage);
        });
    }

    UserLoad() {
        this.af.list(this.USERS, { query: { orderByChild: 'Name' } }).subscribe(snapshots => {
            this.DL.Users = new Array<UserInfo>();
            this.DL.UserAll = new Array<UserInfo>();
            this.DL.UserBorrow = new Array<UserInfo>();
            this.DL.UserSeller = new Array<UserInfo>();
            this.DL.UserSelections = new Array<UserInfo>();

            this.DL.Members = new Array<UserInfo>();
            this.DL.MemberSelections = new Array<UserInfo>();

            snapshots.forEach(snapshot => {
                let info: UserInfo = snapshot;
                info.key = snapshot.$key;

                if (info.IsSystemUser)
                    this.DL.Users.push(info);

                if (info.IsMember)
                    this.DL.Members.push(info);

                if(info.Borrows != null && info.Borrows.length > 0)
                    this.DL.UserBorrow.push(info);
                
                if(info.Sells != null && info.Sells.length > 0)
                    this.DL.UserSeller.push(info);

                this.DL.UserAll.push(info);

                if(this.DL.COMPONENT == "product-sell" && this.DL.UserSelected != null && this.DL.UserSelected.UID == info.UID) {
                    this.DL.UserSelected = info;
                    this.DL.ComputeUserSellInfo(info);
                }

                if (this.DL.User.UID != null && this.DL.User.UID == info.UID)
                    this.DL.User = info;
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
                this.DataLoaded.emit(this.DL.DATA_USER);
            }
        });
    }

    public TransactionCancelMonthlyLoad(selectedYear: number, selectedMonth: number) {
        this.cancelDAL.LoadByYearAndMonth(selectedYear, selectedMonth);
    }

    public SnapshotLoad(keyDay: number) {
        this.snapshotDAL.Load(keyDay);
    }

    public TransactionLoadByKeyDay(keyDay: number) {
        this.transactionDAL.LoadByKeyDay(keyDay);
    }

    public ReportMonthlyLoad(selectedYear: number, selectedMonth: number) {
        this.reportDAL.LoadByYearAndMonth(selectedYear, selectedMonth);
    }

    public ReportReGenerate(keyDay: number) {
        let date = this.core.keyDayToDate(keyDay);
        let keyMonth = this.core.dateToKeyMonth(date);
        this.reportDAL.ReGenerate(date.getFullYear(), keyMonth, keyDay);
    }

    public ReportGenerate(keyDay: number, startCOH: number, actualCOH: number) {
        let date = this.core.keyDayToDate(keyDay);
        let keyMonth = this.core.dateToKeyMonth(date);
        this.reportDAL.Generate(date.getFullYear(), keyMonth, keyDay, startCOH, actualCOH);
    }

    public ExpenseMonthlyLoad(selectedYear: number, selectedMonth: number) {
        this.expenseDAL.LoadByYearAndMonth(selectedYear, selectedMonth);
    }

    public ExpenseLoadTypes() {
        this.expenseDAL.LoadTypes();
    }

    public ExpenseTypeSave(name: string) {
        this.expenseDAL.TypeSave(name);
    }

    public ExpenseTypeDelete(item: NameValue) {
        this.expenseDAL.TypeDelete(item);
    }

    public ProductSave(item: ProductInfo) {
        this.productDAL.Save(item);
    }

    public ArticleSave(item: ArticleInfo) {
        this.articleDAL.Save(item);
        this.articleDAL.Load();
    }

    public ServiceSave(item: ServiceInfo) {
        this.serviceDAL.Save(item);
        this.serviceDAL.Load();
    }

    public ConversationSave(item: ConversationInfo) {
        this.messageDAL.ConversationSave(item);
    }

    public ConversationDelete(item: ConversationInfo) {
        this.messageDAL.ConversationDelete(item);
    }

    public MessageGet(item: ConversationInfo) {
        this.messageDAL.GetMessages(item);
    }

    public MessageSend(message: string) {
        if (this.DL.Conversation) {
            let info = new MessageInfo();
            info.ConversationKey = this.DL.Conversation.key;
            info.ActionDate = this.DL.GetActionDate();
            info.FromKey = this.DL.User.key;
            info.Message = message;
            this.messageDAL.MessageSave(info);
        }
    }

    public UserSave(item: UserInfo) {
        if (item.key)
            this.af.list(this.USERS).update(item.key, item);
        else
            this.af.list(this.USERS).push(item);
    }

    public UserDelete(item: UserInfo) {
        this.af.list(this.USERS).remove(item.key);
    }

    public SubscriptionSave(item: SubscriptionInfo) {
        this.subscriptionDAL.Save(item);
        this.subscriptionDAL.Load();
    }

    public SubscriptionQuotaGenerate(item: QuotaInfo) {
        this.subscriptionDAL.GenerateQuota(item, item.From);
    }

    public SubscriptionQuotaDelete(item: QuotaInfo) {
        this.subscriptionDAL.DeleteQuota(item);
        this.subscriptionDAL.LoadQuota();
    }

    public ShowcaseSave(item: ShowcaseInfo) {
        this.showcaseDAL.Save(item);
        this.showcaseDAL.Load();
    }

    public GallerySave(item: GalleryInfo) {
        this.galleryDAL.Save(item);
        this.galleryDAL.Load();
    }

    GalleryPhotoSave(item: GalleryPhotoInfo) {
        this.galleryDAL.SavePhoto(item);
        this.galleryDAL.LoadPhotos();
    }

    public ShowcaseOrderSave(item: OrderInfo) {
        this.showcaseDAL.SaveOrder(item);
    }

    public ShowcaseOrderForDelivery(item: OrderInfo) {
        let info = this.createTransactionFromOrder(item);

        if (this.DL.ModuleSetting.DeliveryIsToggleOrder)
            this.DL.DeliveryToggledModule = "product-order";

        this.DL.DeliveryStamp = this.DL.GetActionDate();
        this.DeliveryStart(info);
    }

    public ShowcaseOrderToTransaction(item: OrderInfo) {
        let tran = this.createTransactionFromOrder(item);
        this.TransactionInfoSave(tran);
        this.ProductUpdate(tran.Items);
    }

    private createTransactionFromOrder(item: OrderInfo): TransactionInfo {
        let info = new TransactionInfo();
        info.MemberKey = item.MemberKey;
        info.BuyerName = item.BuyerName;
        info.UserKey = this.DL.User.key;
        info.UserName = this.DL.User.Name;
        info.Items = item.Items;
        info.Count = item.Count;
        info.Amount = item.Amount;
        info.ActionDate = this.DL.GetActionDate();
        info.KeyDay = this.DL.KeyDay;
        info.Source = this.DL.SOURCE_ORDER;
        return info;
    }

    public ShowcaseOrderDelete(item: OrderInfo) {
        this.showcaseDAL.DeleteOrder(item);
    }

    public ServiceReservationToTransaction(item: ReservationInfo) {
        let tran = this.createTransactionFromReservation(item);
        this.TransactionInfoSave(tran);
    }

    private createTransactionFromReservation(item: ReservationInfo): TransactionInfo {
        let info = new TransactionInfo();
        info.MemberKey = item.MemberKey;
        info.BuyerName = item.MemberName
        info.UserKey = this.DL.User.key;
        info.UserName = this.DL.User.Name;
        
        info.Items = new Array<SellInfo>();
        let sell = new SellInfo();
        sell.Code = "Service";
        sell.Description = item.Name;
        sell.Price = item.Price;
        sell.Quantity = item.Count;
        sell.Total = item.Price * item.Count;
        info.Items.push(sell);

        info.Count = sell.Quantity;
        info.Amount = sell.Total;
        info.ActionDate = this.DL.GetActionDate();
        info.KeyDay = this.DL.KeyDay;
        info.Source = this.DL.SOURCE_RESERVATION;
        return info;
    }

    public ServiceReserveSave(item: ReservationInfo) {
        this.serviceDAL.SaveReservation(item);
    }

    public ServiceReserveDelete(item: ReservationInfo) {
        this.serviceDAL.DeleteReservation(item);
    }

    public AccessSave(item: AccessInfo) {
        this.accessDAL.Save(item);
    }

    public SellInfoAdd(user: UserInfo, item: SellInfo) {
        if(user.Sells == null)
            user.Sells = new Array<SellInfo>();

        user.Sells.push(item);
        this.UserSave(user);
    }

    public SellInfoRequestDelete(user: UserInfo, item: SellInfo) {
        item.ForDelete = true;
        this.UserSave(user);
    }

    public SellInfoDelete(user: UserInfo, item: SellInfo) {
        user.Sells = user.Sells.filter(s => !(s.Code == item.Code));
        this.UserSave(user);
    }

    public SellInfoClear(user: UserInfo) {
        user.Sells = new Array<SellInfo>();
        this.UserSave(user);
    }


    public SnapshotSave(item: SnapshotInfo) {
        this.snapshotDAL.Save(item);
        this.snapshotDAL.Load(this.DL.KeyDay);
    }

    public SellInfoDone(user: UserInfo, memberKey: string, buyerName: string, isDelivery: boolean) {
        this.transactionDAL.SellDone(user, memberKey, buyerName, isDelivery);
    }

    public DeliverySave(item: DeliveryInfo) {
        this.transactionDAL.DeliverySave(item);
    }

    public DeliveryDelete(item: DeliveryInfo) {
        this.transactionDAL.DeliveryDelete(item);
    }

    public DeliveryToTransaction(info: DeliveryInfo) {
        this.transactionDAL.DeliveryToTransaction(info);
    }

    public DeliveryStart(info: TransactionInfo) {
        this.transactionDAL.DeliveryStart(info);
    }

    public ProductUpdate(infos: Array<SellInfo>) {
        this.productDAL.UpdateProducts(infos);
    }

    public TransactionCancel(description: string, tran: TransactionInfo) {
        this.cancelDAL.CancelSelected(description, tran);
    }

    public TransactionInfoSave(item: TransactionInfo) {
        this.transactionDAL.Save(item);
        this.ReportReGenerate(item.KeyDay);
    }

    public CancelInfoSave(item: CancelInfo) {
        this.cancelDAL.Save(item);
    }

    public ExpenseInfoSave(item: ExpenseInfo) {
        this.expenseDAL.Save(item);
    }

    public ExpenseDelete(item: ExpenseInfo) {
        this.expenseDAL.Delete(item);
    }

    public ReportSave(item: ReportInfo) {
        this.reportDAL.Save(item);
    }

    public ModuleSettingSave(item: ModuleSettingInfo) {
        this.settingDAL.ModuleSave(item);
    }

    public SystemSettingSave(item: SystemSettingInfo) {
        this.settingDAL.SystemSave(item);
    }
}