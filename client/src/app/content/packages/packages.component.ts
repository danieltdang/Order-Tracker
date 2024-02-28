import { Component } from '@angular/core';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css'
})
export class PackagesComponent {

  orders: any;

  constructor(private apiService: ApiService) { }

  getOrderId(index : number, order : any) {
    return order.orderID;
  }

  ngOnInit(): void {
    this.apiService.getOrders().subscribe((fetchedData) => {
      this.orders = fetchedData;
    });
  }
}
