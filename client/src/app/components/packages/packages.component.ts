import { Component } from '@angular/core';
import { Table } from 'primeng/table';
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
    this.apiService.getOrders().subscribe((fetchedData: any) => {
      this.orders = fetchedData.data;
    });
  }

  clear(table: Table) {
    table.clear();
  }
}
