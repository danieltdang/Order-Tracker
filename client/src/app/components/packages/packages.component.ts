import { Component } from '@angular/core';
import { Table } from 'primeng/table';
import { ApiService } from '../../api.service';
import { PackageStatusService } from './package-status.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css'
})
export class PackagesComponent {
  orders: any;
  selectedOrders: any;
  constructor(private apiService: ApiService, private router: Router, private statusService: PackageStatusService) { }

  getOrderId(index : number, order : any) {
    return order.orderID;
  }

  ngOnInit(): void {
    this.apiService.getAllUserOrders().subscribe((fetchedData: any) => {
      this.orders = fetchedData.data;
    });
  }

  clear(table: Table) {
    table.clear();
  }

  onRowSelect(event: any) {
    this.router.navigate(['app/packages', event.data.orderID]);
  }

  getStatus(status: number) {
    return this.statusService.getStatus(status);
  }

  formatDate(date: string) {
    return this.statusService.formatDate(date);
  }
}
