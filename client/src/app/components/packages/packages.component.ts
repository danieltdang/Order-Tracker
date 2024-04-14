import { Component } from '@angular/core';
import { Table } from 'primeng/table';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css'
})
export class PackagesComponent {
  orders: any;

  constructor(private apiService: ApiService, private router: Router) { }

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

  onRowSelect(event: any) {
    this.router.navigate(['app/packages', event.data.orderID]);
  }
}
