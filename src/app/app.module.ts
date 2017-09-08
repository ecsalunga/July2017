import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'hammerjs';
import 'firebase/storage';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MdInputModule, 
  MdButtonModule,
  MdCheckboxModule,
  MdCardModule,
  MdChipsModule,
  MdSelectModule,
  MdDatepickerModule,
  MdNativeDateModule,
  MdAutocompleteModule,
  MdMenuModule,
  MdToolbarModule,
  MdIconModule,
  MdSnackBarModule,
  MdSlideToggleModule,
  DateAdapter
 } from '@angular/material';

import { AngularFireModule } from 'angularfire2'
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { environment } from '../environments/environment';

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
import { DashboardHomeComponent } from './dashboard/home/dashboard-home.component';
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

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductDetailComponent,
    MemberListComponent,
    MemberDetailComponent,
    TransactionListComponent,
    TransactionDetailComponent,
    ShowcaseListComponent,
    ShowcaseDetailComponent,
    ShowcaseWidgetComponent,
    ShowcaseScheduleComponent,
    UserListComponent,
    AccessListComponent,
    AccessDetailComponent,
    TransactionCancelComponent,
    ReportListComponent,
    ReportExpenseComponent,
    ProductSellComponent,
    DashboardHomeComponent,
    ReportBalancingComponent,
    ReportDetailComponent,
    UserDetailComponent,
    DeliveryListComponent,
    DeliveryDetailComponent,
    SettingModuleComponent,
    SnapshotListComponent,
    SnapshotDetailComponent,
    UserSignupComponent,
    UserLoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdInputModule,
    MdCheckboxModule,
    MdCardModule,
    MdChipsModule,
    MdAutocompleteModule,
    MdSelectModule,
    MdMenuModule,
    MdToolbarModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdIconModule,
    MdSlideToggleModule,
    MdSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [Core, DataAccess, DataLayer],
  bootstrap: [AppComponent],
  entryComponents: [ 
    ProductListComponent,
    ProductDetailComponent,
    MemberListComponent,
    MemberDetailComponent,
    TransactionListComponent,
    TransactionDetailComponent,
    ShowcaseListComponent,
    ShowcaseDetailComponent,
    ShowcaseWidgetComponent,
    ShowcaseScheduleComponent,
    UserListComponent,
    AccessListComponent,
    AccessDetailComponent,
    TransactionCancelComponent,
    ReportListComponent,
    ReportExpenseComponent,
    ProductSellComponent,
    DashboardHomeComponent,
    ReportBalancingComponent,
    ReportDetailComponent,
    UserDetailComponent,
    DeliveryListComponent,
    DeliveryDetailComponent,
    SettingModuleComponent,
    SnapshotListComponent,
    SnapshotDetailComponent,
    UserSignupComponent,
    UserLoginComponent
  ]
})
export class AppModule {
}