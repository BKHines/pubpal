import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/providers/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  constructor(public loadingSvc: LoadingService) { }

  ngOnInit() {
  }

}
