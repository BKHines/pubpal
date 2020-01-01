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
import { ItementryPage } from './itementry/itementry.page';
import { ItemlistPage } from './itemlist/itemlist.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: '', component: SellerPage },
  { path: 'registration', component: RegistrationPage },
  { path: 'purchases', component: PurchasesPage },
  { path: 'items', component: ItemlistPage },
  { path: 'items/newentry', component: ItementryPage },
  { path: 'items/entry/:id', component: ItementryPage },
  { path: 'login', component: LoginPage }
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: PubpalinterceptorService, multi: true }
  ],
  declarations: [
    SellerPage,
    RegistrationPage,
    PurchasesPage,
    ItemlistPage,
    ItementryPage,
    LoginPage
  ]
})
export class SellerPageModule { }
