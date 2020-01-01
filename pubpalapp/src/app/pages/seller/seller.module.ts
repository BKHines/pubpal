import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SellerPage } from './seller.page';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PubpalinterceptorService } from 'src/app/providers/pubpalinterceptor.service';
import { RegistrationPage } from './registration/registration.page';
import { LoginPage } from './login/login.page';
import { PurchasesPage } from './purchases/purchases.page';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { ItementryPage } from './itementry/itementry.page';
import { CurrencyformatPipe } from 'src/app/shared/pipes/currencyformat.pipe';
import { ArraybypropertyPipe } from 'src/app/shared/pipes/arraybyproperty.pipe';

const routes: Routes = [
  { path: '', component: SellerPage },
  { path: 'registration', component: RegistrationPage },
  { path: 'purchases', component: PurchasesPage },
  { path: 'itementry', component: ItementryPage },
  { path: 'login', component: LoginPage }
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    CurrencyPipe,
    ArraybypropertyPipe,
    { provide: HTTP_INTERCEPTORS, useClass: PubpalinterceptorService, multi: true }
  ],
  declarations: [
    CurrencyformatPipe,
    ArraybypropertyPipe,
    SellerPage,
    RegistrationPage,
    PurchasesPage,
    ItementryPage,
    LoginPage
  ]
})
export class SellerPageModule { }
