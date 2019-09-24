import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './features/user/user.component';
import { HomeComponent } from './features/home/home.component';
// import { LoginComponent } from './features/login/login.component';
import { RegistrationComponent } from './features/registration/registration.component';
import { AuthGuard } from './guards/auth.guard';
import { SellerComponent } from './features/seller/seller.component';
import { ChangepasswordComponent } from './features/changepassword/changepassword.component';
import { PurchasableitemsComponent } from './features/seller/purchasableitems/purchasableitems.component';
import { AuthuserGuard } from './guards/authuser.guard';
import { AuthsellerGuard } from './guards/authseller.guard';
import { PurchaseoptionsComponent } from './features/user/purchaseoptions/purchaseoptions.component';
import { PurchasequeueComponent } from './features/seller/purchasequeue/purchasequeue.component';
import { PurchasehistoryComponent } from './features/user/purchasehistory/purchasehistory.component';
import { PurchasestatusComponent } from './features/user/purchasestatus/purchasestatus.component';
import { SellersearchComponent } from './features/user/sellersearch/sellersearch.component';
import { ResetpasswordupdateComponent } from './features/resetpasswordupdate/resetpasswordupdate.component';
import { ResetpasswordComponent } from './features/resetpassword/resetpassword.component';
import { ResetpasswordcancelComponent } from './features/resetpasswordcancel/resetpasswordcancel.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard, AuthuserGuard] },
  { path: 'seller', component: SellerComponent, canActivate: [AuthGuard, AuthsellerGuard] },
  { path: 'changepassword', component: ChangepasswordComponent, canActivate: [AuthGuard] },
  { path: 'resetpassword', component: ResetpasswordComponent },
  { path: 'resetpasswordupdate/:id/:email', component: ResetpasswordupdateComponent },
  { path: 'cancelreset/:id', component: ResetpasswordcancelComponent },
  { path: 'purchitem', component: PurchasableitemsComponent, canActivate: [AuthGuard, AuthsellerGuard] },
  { path: 'purchase/options', component: PurchaseoptionsComponent, canActivate: [AuthGuard, AuthuserGuard] },
  { path: 'purchase/options/:id', component: PurchaseoptionsComponent, canActivate: [AuthGuard, AuthuserGuard] },
  { path: 'sellersearch', component: SellersearchComponent, canActivate: [AuthGuard, AuthuserGuard] },
  { path: 'purchasequeue', component: PurchasequeueComponent, canActivate: [AuthGuard, AuthsellerGuard] },
  { path: 'purchasehistory', component: PurchasehistoryComponent, canActivate: [AuthGuard, AuthuserGuard] },
  { path: 'purchasestatus/:id', component: PurchasestatusComponent, canActivate: [AuthGuard, AuthuserGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
