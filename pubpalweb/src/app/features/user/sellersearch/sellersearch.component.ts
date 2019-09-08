import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { LoadingService } from 'src/app/providers/loading.service';
import { APIResponse, SellerModel } from 'src/app/shared/models';

@Component({
  selector: 'app-sellersearch',
  templateUrl: './sellersearch.component.html',
  styleUrls: ['./sellersearch.component.scss']
})
export class SellersearchComponent implements OnInit {
  searchText: string;
  sellers: SellerModel[];

  constructor(private userSvc: UserService, private loadingSvc: LoadingService) { }

  ngOnInit() {
  }

  searchSeller(searchtext: string) {
    this.loadingSvc.addMessage('SearchSellers', 'Searching for sellers...');
    this.userSvc.getSellersByTagSearch(searchtext, 39.344, -84.537).subscribe((res: APIResponse) => {
      this.sellers = res.result as SellerModel[];
      this.loadingSvc.removeMessage('SearchSellers');
    });
  }

}
