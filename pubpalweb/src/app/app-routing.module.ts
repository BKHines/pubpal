import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './features/user/user.component';
import { HomeComponent } from './features/home/home.component';
// import { LoginComponent } from './features/login/login.component';
import { RegistrationComponent } from './features/registration/registration.component';
import { AuthGuard } from './guards/auth.guard';
import { SellerComponent } from './features/seller/seller.component';
import { ChangepasswordComponent } from './features/changepassword/changepassword.component';
import { PurchasableitemsComponent } from './features/purchasableitems/purchasableitems.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'user', component: UserComponent, canActivate: [ AuthGuard ] },
  { path: 'seller', component: SellerComponent, canActivate: [ AuthGuard ] },
  { path: 'changepassword', component: ChangepasswordComponent, canActivate: [ AuthGuard ] },
  { path: 'purchitem', component: PurchasableitemsComponent, canActivate: [ AuthGuard ] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
