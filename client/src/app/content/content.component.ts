import { Component } from '@angular/core';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

  orders: any;

  constructor(private apiService: ApiService) { }

  getOrderId(index : number, order : any) {
    return order.id;
  }

  ngOnInit(): void {
    this.apiService.getOrders().subscribe((fetchedData) => {
      this.orders = fetchedData;
    });
  }
}
