import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'hammerjs';
import 'firebase/storage';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MdInputModule, MdButtonModule, MdCheckboxModule,
  MdCardModule, MdSelectModule, MdDatepickerModule,
  MdNativeDateModule, MdAutocompleteModule, MdMenuModule,
  MdIconModule, MdSnackBarModule, MdDialogModule,
  MdSlideToggleModule, MdTooltipModule, MdTabsModule,
  DateAdapter
 } from '@angular/material';
import { AngularFireModule } from 'angularfire2'
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { NgxGalleryModule } from 'ngx-gallery';
import { Core } from './core';
import { DataAccess, DataLayer } from './data';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { AppComponent } from './app.component';
import { ProductListComponent } from './product/list/product-list.component';
import { ProductDetailComponent } from './product/detail/product-detail.component';
import { MemberListComponent } from './member/list/member-list.component';
import { MemberDetailComponent } from './member/detail/member-detail.component';
import { TransactionListComponent } from './transaction/list/transaction-list.component';
import { TransactionDetailComponent } from './transaction/detail/transaction-detail.component';
import { ShowcaseListComponent } from './showcase/list/showcase-list.component';
import { ShowcaseDetailComponent } from './showcase/detail/showcase-detail.component';
import { ShowcaseWidgetComponent } from './showcase/widget/showcase-widget.component';
import { ShowcaseScheduleComponent } from './showcase/schedule/showcase-schedule.component';
import { UserListComponent } from './user/list/user-list.component';
import { AccessListComponent } from './access/list/access-list.component';
import { AccessDetailComponent } from './access/detail/access-detail.component';
import { TransactionCancelComponent } from './transaction/cancel/transaction-cancel.component';
import { ReportListComponent } from './report/list/report-list.component';
import { ReportExpenseComponent } from './report/expense/report-expense.component';
import { ProductSellComponent } from './product/sell/product-sell.component';
import { ReportBalancingComponent } from './report/balancing/report-balancing.component';
import { ReportDetailComponent } from './report/detail/report-detail.component';
import { UserDetailComponent } from './user/detail/user-detail.component';
import { DeliveryListComponent } from './delivery/list/delivery-list.component';
import { DeliveryDetailComponent } from './delivery/detail/delivery-detail.component';
import { SettingModuleComponent } from './setting/module/setting-module.component';
import { SnapshotListComponent } from './snapshot/list/snapshot-list.component';
import { SnapshotDetailComponent } from './snapshot/detail/snapshot-detail.component';
import { UserSignupComponent } from './user/signup/user-signup.component';
import { UserLoginComponent } from './user/login/user-login.component';
import { UserUpdateComponent } from './user/update/user-update.component';
import { SettingSystemComponent } from './setting/system/setting-system.component';
import { ProductOrderComponent } from './product/order/product-order.component';
import { ShowcaseCartComponent } from './showcase/cart/showcase-cart.component';
import { ProductOrderDetailComponent } from './product/order-detail/product-order-detail.component';
import { ServiceListComponent } from './service/list/service-list.component';
import { ServiceDetailComponent } from './service/detail/service-detail.component';
import { MessageListComponent } from './message/list/message-list.component';
import { MessageDetailComponent } from './message/detail/message-detail.component';
import { MessageMessageComponent } from './message/message/message-message.component';
import { MessagePopupComponent } from './message/popup/message-popup.component';
import { WebsiteHomeComponent } from './website/home/website-home.component';
import { WebsiteCatalogComponent } from './website/catalog/website-catalog.component';
import { ServiceScheduleComponent } from './service/schedule/service-schedule.component';
import { ServiceWidgetComponent } from './service/widget/service-widget.component';
import { WebsiteReservationComponent } from './website/reservation/website-reservation.component';
import { ServiceReserveComponent } from './service/reserve/service-reserve.component';
import { ServiceReservationComponent } from './service/reservation/service-reservation.component';
import { ServiceReservationDetailComponent } from './service/reservation-detail/service-reservation-detail.component';
import { ServiceBookingComponent } from './service/booking/service-booking.component';
import { ReportExpenseDetailComponent } from './report/expense-detail/report-expense-detail.component';
import { SettingModuleExpenseTypeComponent } from './setting/module-expense-type/setting-module-expense-type.component';
import { UserBorrowComponent } from './user/borrow/user-borrow.component';
import { UserBorrowDetailComponent } from './user/borrow-detail/user-borrow-detail.component';
import { UserSellerComponent } from './user/seller/user-seller.component';
import { SubscriptionListComponent } from './subscription/list/subscription-list.component';
import { SubscriptionDetailComponent } from './subscription/detail/subscription-detail.component';
import { SubscriptionSubscriberComponent } from './subscription/subscriber/subscription-subscriber.component';
import { SubscriptionProductComponent } from './subscription/product/subscription-product.component';
import { SubscriptionQuotaComponent } from './subscription/quota/subscription-quota.component';
import { SubscriptionQuotaDetailComponent } from './subscription/quota-detail/subscription-quota-detail.component';
import { ArticleListComponent } from './article/list/article-list.component';
import { ArticleDetailComponent } from './article/detail/article-detail.component';
import { WebsiteArticleComponent } from './website/article/website-article.component';
import { WebsiteArticleFullComponent } from './website/article-full/website-article-full.component';
import { GalleryListComponent } from './gallery/list/gallery-list.component';
import { GalleryDetailComponent } from './gallery/detail/gallery-detail.component';
import { GalleryPhotoListComponent } from './gallery/photo-list/gallery-photo-list.component';
import { GalleryPhotoDetailComponent } from './gallery/photo-detail/gallery-photo-detail.component';
import { WebsiteGalleryComponent } from './website/gallery/website-gallery.component';
import { GalleryWidgetComponent } from './gallery/widget/gallery-widget.component';

@NgModule({
  declarations: [
    AppComponent, ProductListComponent, ProductDetailComponent,
    MemberListComponent, MemberDetailComponent, TransactionListComponent,
    TransactionDetailComponent, ShowcaseListComponent, ShowcaseDetailComponent,
    ShowcaseWidgetComponent, ShowcaseScheduleComponent, UserListComponent,
    AccessListComponent, AccessDetailComponent, TransactionCancelComponent,
    ReportListComponent, ReportExpenseComponent, ProductSellComponent,
    WebsiteHomeComponent, ReportBalancingComponent, ReportDetailComponent,
    UserDetailComponent, DeliveryListComponent, DeliveryDetailComponent,
    SettingModuleComponent, SnapshotListComponent, SnapshotDetailComponent,
    UserSignupComponent, UserLoginComponent, UserUpdateComponent,
    SettingSystemComponent, ProductOrderComponent, ShowcaseCartComponent,
    ProductOrderDetailComponent, ServiceListComponent, ServiceDetailComponent,
    MessageListComponent, MessageDetailComponent, MessageMessageComponent,
    MessagePopupComponent, WebsiteCatalogComponent, ServiceScheduleComponent, 
    ServiceWidgetComponent, WebsiteReservationComponent, ServiceReserveComponent,
    ServiceReservationComponent, ServiceReservationDetailComponent, ServiceBookingComponent, 
    ReportExpenseDetailComponent, SettingModuleExpenseTypeComponent, UserBorrowComponent,
    UserBorrowDetailComponent, UserSellerComponent, SubscriptionListComponent,
    SubscriptionDetailComponent, SubscriptionSubscriberComponent, SubscriptionProductComponent,
    SubscriptionProductComponent, SubscriptionQuotaComponent, SubscriptionQuotaDetailComponent,
    ArticleListComponent, ArticleDetailComponent, WebsiteArticleComponent, 
    WebsiteArticleFullComponent, GalleryListComponent, GalleryDetailComponent,
    GalleryPhotoListComponent, GalleryPhotoDetailComponent, WebsiteGalleryComponent,
    GalleryWidgetComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, MdButtonModule,
    MdInputModule, MdCheckboxModule, MdCardModule,
    MdAutocompleteModule, MdSelectModule, MdMenuModule,
    MdDatepickerModule, MdNativeDateModule, MdIconModule,
    MdSlideToggleModule, MdSnackBarModule, MdTooltipModule,
    FormsModule, MdDialogModule, MdTabsModule,
    ReactiveFormsModule, AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, AngularFireDatabaseModule, NgxGalleryModule
  ],
  providers: [Core, DataAccess, DataLayer],
  bootstrap: [AppComponent],
  entryComponents: [ 
    ProductListComponent, ProductDetailComponent, MemberListComponent,
    MemberDetailComponent, TransactionListComponent, TransactionDetailComponent,
    ShowcaseListComponent, ShowcaseDetailComponent, ShowcaseWidgetComponent,
    ShowcaseScheduleComponent, UserListComponent, AccessListComponent,
    AccessDetailComponent, TransactionCancelComponent, ReportListComponent,
    ReportExpenseComponent, ProductSellComponent, WebsiteHomeComponent,
    ReportBalancingComponent, ReportDetailComponent, UserDetailComponent,
    DeliveryListComponent, DeliveryDetailComponent, SettingModuleComponent,
    SnapshotListComponent, SnapshotDetailComponent, UserSignupComponent,
    UserLoginComponent, UserUpdateComponent, SettingSystemComponent,
    ProductOrderComponent, ShowcaseCartComponent, ProductOrderDetailComponent,
    ServiceListComponent, ServiceDetailComponent, MessageListComponent,
    MessageDetailComponent, MessageMessageComponent, MessagePopupComponent,
    WebsiteCatalogComponent, ServiceScheduleComponent, ServiceWidgetComponent,
    WebsiteReservationComponent, ServiceReserveComponent, ServiceReservationComponent,
    ServiceReservationDetailComponent, ServiceBookingComponent, ReportExpenseDetailComponent,
    SettingModuleExpenseTypeComponent, UserBorrowComponent, UserBorrowDetailComponent,
    UserSellerComponent, SubscriptionListComponent, SubscriptionDetailComponent,
    SubscriptionSubscriberComponent, SubscriptionProductComponent, SubscriptionQuotaComponent,
    SubscriptionQuotaDetailComponent, ArticleListComponent, ArticleDetailComponent,
    WebsiteArticleComponent, WebsiteArticleFullComponent, GalleryListComponent,
    GalleryDetailComponent, GalleryPhotoListComponent, GalleryPhotoDetailComponent,
    WebsiteGalleryComponent, GalleryWidgetComponent
  ]
})
export class AppModule {
}