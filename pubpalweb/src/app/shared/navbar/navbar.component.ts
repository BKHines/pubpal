import { Component, OnInit } from '@angular/core';
import { faBeer } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/providers/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  faBeer = faBeer;

  constructor(public userSvc: UserService) { }

  ngOnInit() {
  }

}
