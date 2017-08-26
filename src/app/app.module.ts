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
  MdTooltipModule,
  MdSelectModule,
  MdDatepickerModule,
  MdNativeDateModule,
  MdAutocompleteModule,
  MdMenuModule,
  MdToolbarModule,
  MdIconModule,
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
import { SellComponent } from './sell/sell.component';
import { TransactionListComponent } from './transaction/list/transaction-list.component';
import { TransactionDetailComponent } from './transaction/detail/transaction-detail.component';
import { ExpenseComponent } from './expense/expense.component';
import { ReportComponent } from './report/report.component';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShowcaseListComponent } from './showcase/list/showcase-list.component';
import { ShowcaseDetailComponent } from './showcase/detail/showcase-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductDetailComponent,
    MemberListComponent,
    MemberDetailComponent,
    SellComponent,
    TransactionListComponent,
    TransactionDetailComponent,
    ExpenseComponent,
    ReportComponent,
    UserComponent,
    HomeComponent,
    DashboardComponent,
    ShowcaseListComponent,
    ShowcaseDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdInputModule,
    MdCheckboxModule,
    MdCardModule,
    MdChipsModule,
    MdTooltipModule,
    MdAutocompleteModule,
    MdSelectModule,
    MdMenuModule,
    MdToolbarModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdIconModule,
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
    SellComponent,
    TransactionListComponent,
    TransactionDetailComponent,
    ExpenseComponent,
    ReportComponent,
    UserComponent,
    HomeComponent,
    DashboardComponent,
    ShowcaseListComponent,
    ShowcaseDetailComponent
  ]
})
export class AppModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('sv-SE'); // DD.MM.YYYY
  }
}
