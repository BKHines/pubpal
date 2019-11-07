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

const routes: Routes = [
  { path: '', component: UserPage },
  { path: 'registration', component: RegistrationPage },
  { path: 'login', component: LoginPage },
  { path: 'purchase/sellers', component: AvailablesellersPage }
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
  declarations: [UserPage, RegistrationPage, LoginPage, AvailablesellersPage]
})
export class UserPageModule { }
