import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'hammerjs';

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
  DateAdapter
 } from '@angular/material';

import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

import { Core } from './core';
import { DataAccess, DataLayer } from './data';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { AppComponent } from './app.component';
import { TesterComponent } from './tester/tester.component';

import { ProductListComponent } from './product/list/product-list.component';
import { ProductDetailComponent } from './product/detail/product-detail.component';

import { MemberListComponent } from './member/list/member-list.component';
import { MemberDetailComponent } from './member/detail/member-detail.component';
import { SellComponent } from './sell/sell.component';
import { TransactionListComponent } from './transaction/list/transaction-list.component';
import { TransactionDetailComponent } from './transaction/detail/transaction-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    TesterComponent,
    ProductListComponent,
    ProductDetailComponent,
    MemberListComponent,
    MemberDetailComponent,
    SellComponent,
    TransactionListComponent,
    TransactionDetailComponent
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
    MdDatepickerModule,
    MdNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  providers: [Core, DataAccess, DataLayer],
  bootstrap: [AppComponent],
  entryComponents: [ 
    TesterComponent,
    ProductListComponent,
    ProductDetailComponent,
    MemberListComponent,
    MemberDetailComponent,
    SellComponent,
    TransactionListComponent,
    TransactionDetailComponent
  ]
})
export class AppModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('sv-SE'); // DD.MM.YYYY
  }
}
