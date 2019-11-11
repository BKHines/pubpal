import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { PubpalinterceptorService } from 'src/app/providers/pubpalinterceptor.service';
import { UserPage } from './user.page';
import { RegistrationPage } from './registration/registration.page';
import { LoginPage } from './login/login.page';
import { AvailablesellersPage } from './availablesellers/availablesellers.page';
import { SellerdetailsPage } from './sellerdetails/sellerdetails.page';
import { PurchaseoptionsPage } from './purchaseoptions/purchaseoptions.page';
import { ArraybypropertyPipe } from 'src/app/shared/pipes/arraybyproperty.pipe';
import { ArraymaxdisplayPipe } from 'src/app/shared/pipes/arraymaxdisplay.pipe';
import { PurchasehistoryPage } from './purchasehistory/purchasehistory.page';

const routes: Routes = [
  { path: '', component: UserPage },
  { path: 'registration', component: RegistrationPage },
  { path: 'login', component: LoginPage },
  { path: 'purchase/sellers', component: AvailablesellersPage },
  { path: 'purchase/seller/:id', component: SellerdetailsPage },
  { path: 'purchase/seller/:id/:optionid', component: PurchaseoptionsPage },
  { path: 'purchasehistory', component: PurchasehistoryPage }
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: PubpalinterceptorService, multi: true }
  ],
  declarations: [
    ArraybypropertyPipe,
    ArraymaxdisplayPipe,
    UserPage,
    RegistrationPage,
    LoginPage,
    AvailablesellersPage,
    SellerdetailsPage,
    PurchaseoptionsPage,
    PurchasehistoryPage
  ]
})
export class UserPageModule { }
