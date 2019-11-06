import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SellerPage } from './seller.page';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PubpalinterceptorService } from 'src/app/providers/pubpalinterceptor.service';
import { RegistrationPage } from './registration/registration.page';
import { LoginPage } from './login/login.page';

const routes: Routes = [
  { path: '', component: SellerPage },
  { path: 'registration', component: RegistrationPage },
  { path: 'login', component: LoginPage }
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
  declarations: [SellerPage, RegistrationPage, LoginPage]
})
export class SellerPageModule {}
