import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public userSvc: UserService) { }

  ngOnInit() {
  }

}
