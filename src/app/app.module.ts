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
  MdDatepickerModule,
  MdNativeDateModule
 } from '@angular/material';

import { Core } from './core';
import { Data } from './data';

import { FormsModule }   from '@angular/forms';
import { AppComponent } from './app.component';
import { TesterComponent } from './tester/tester.component';
import { ProductListComponent } from './product/list/product-list.component';
import { ProductDetailComponent } from './product/detail/product-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    TesterComponent,
    ProductListComponent,
    ProductDetailComponent
  ],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule,
    MdButtonModule,
    MdInputModule,
    MdCheckboxModule,
    MdCardModule,
    MdChipsModule,
    MdDatepickerModule,
    MdNativeDateModule,
    FormsModule
  ],
  providers: [Core, Data],
  bootstrap: [AppComponent],
  entryComponents: [ 
    TesterComponent,
    ProductListComponent,
    ProductDetailComponent
  ]
})
export class AppModule { }
