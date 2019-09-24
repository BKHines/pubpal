import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxMaskModule } from 'ngx-mask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PubpalinterceptorService } from './providers/pubpalinterceptor.service';
import { UserComponent } from './features/user/user.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { RegistrationComponent } from './features/registration/registration.component';
import { ModalcontainerComponent } from './shared/modalcontainer/modalcontainer.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { SellerComponent } from './features/seller/seller.component';
import { ChangepasswordComponent } from './features/changepassword/changepassword.component';
import { PurchasableitementryComponent } from './features/seller/purchasableitementry/purchasableitementry.component';
import { PurchasableitemsComponent } from './features/seller/purchasableitems/purchasableitems.component';
import { PurchaseentryComponent } from './features/user/purchaseentry/purchaseentry.component';
import { PurchasestatusComponent } from './features/user/purchasestatus/purchasestatus.component';
import { PurchasehistoryComponent } from './features/user/purchasehistory/purchasehistory.component';
import { PurchaseoptionsComponent } from './features/user/purchaseoptions/purchaseoptions.component';
import { PurchasequeueComponent } from './features/seller/purchasequeue/purchasequeue.component';
import { ArraybypropertyPipe } from './shared/pipes/arraybyproperty.pipe';
import { SellersearchComponent } from './features/user/sellersearch/sellersearch.component';
import { CanceltextboxComponent } from './shared/canceltextbox/canceltextbox.component';
import { CartviewerComponent } from './features/user/cartviewer/cartviewer.component';
import { ResetpasswordComponent } from './features/resetpassword/resetpassword.component';
import { ResetpasswordupdateComponent } from './features/resetpasswordupdate/resetpasswordupdate.component';
import { ResetpasswordcancelComponent } from './features/resetpasswordcancel/resetpasswordcancel.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent,
    ModalcontainerComponent,
    LoadingComponent,
    SellerComponent,
    ChangepasswordComponent,
    PurchasableitementryComponent,
    PurchasableitemsComponent,
    PurchaseentryComponent,
    PurchasestatusComponent,
    PurchasehistoryComponent,
    PurchaseoptionsComponent,
    PurchasequeueComponent,
    ArraybypropertyPipe,
    SellersearchComponent,
    CanceltextboxComponent,
    CartviewerComponent,
    ResetpasswordComponent,
    ResetpasswordupdateComponent,
    ResetpasswordcancelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FontAwesomeModule, // free font awesome icons: https://fontawesome.com/icons?d=gallery
    ModalModule.forRoot(),
    NgxMaskModule.forRoot(),
    TypeaheadModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: PubpalinterceptorService, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    UserComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent,
    ModalcontainerComponent,
    LoadingComponent,
    SellerComponent,
    ChangepasswordComponent,
    PurchasableitemsComponent,
    PurchasableitementryComponent,
    PurchaseentryComponent,
    PurchasestatusComponent,
    PurchasehistoryComponent,
    PurchaseoptionsComponent,
    PurchasequeueComponent,
    SellersearchComponent,
    CartviewerComponent
  ]
})
export class AppModule { }
