import { Component, OnInit, Input } from '@angular/core';
import { faBeer } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/providers/user.service';
import { LocalstoreService } from 'src/app/providers/localstore.service';
import { CONSTANTS } from '../constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  faBeer = faBeer;
  @Input() showuserlinks: boolean;

  constructor(
    public userSvc: UserService,
    private localStoreSvc: LocalstoreService,
    private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.userSvc.logout();
    this.localStoreSvc.removeMultiple([CONSTANTS.KEY_STORE_KEY, CONSTANTS.KEY_STORE_USEREMAIL]);
    this.router.navigate(['']);
  }
}
