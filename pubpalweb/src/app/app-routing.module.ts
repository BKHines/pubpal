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

const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'user', component: UserComponent, canActivate: [ AuthGuard, AuthuserGuard ] },
  { path: 'seller', component: SellerComponent, canActivate: [ AuthGuard, AuthsellerGuard ] },
  { path: 'changepassword', component: ChangepasswordComponent, canActivate: [ AuthGuard ] },
  { path: 'purchitem', component: PurchasableitemsComponent, canActivate: [ AuthGuard, AuthsellerGuard ] },
  { path: 'purchase/options', component: PurchaseoptionsComponent, canActivate: [ AuthGuard, AuthuserGuard ] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
