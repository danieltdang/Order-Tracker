import { Component } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { PackageStatusService } from './package-status.service';
import { Router } from '@angular/router';

import { Order } from '../../interfaces/order';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css',
  providers: [MessageService, ConfirmationService]
})
export class PackagesComponent {
  order!: Order;
  orders!: Order[];
  selectedOrders!: Order[] | null;
  dateAdded!: Date;
  estimatedDelivery!: Date;
  statuses!: any[];
  submitted: boolean = false;
  orderDialog: boolean = false;

  constructor(private apiService: ApiService, private router: Router, private statusService: PackageStatusService,
              private messageService: MessageService, private confirmationService: ConfirmationService) { }

  getOrderId(index : number, order : any) {
    return order.orderID;
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.orders.length; i++) {
        if (this.orders[i].orderID === id) {
            index = i;
            break;
        }
    }

    return index;
}

  editOrder(order: Order) {
    this.order = { ...order };
    this.dateAdded = new Date(order.dateAdded);
    this.estimatedDelivery = new Date(order.estimatedDelivery);
    this.orderDialog = true;
  }

  deleteOrder(order: Order) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + order.productName + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.orders = this.orders.filter((val: any) => val.id !== order.orderID);
            this.order = {
              uuid: '',
              orderID: '',
              productName: '',
              status: '',
              trackingCode: '',
              estimatedDelivery: '',
              carrier: '',
              source: '',
              dateAdded: ''
            };
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Deleted', life: 3000 });
        }
    });
  }

  hideDialog() {
    this.orderDialog = false;
    this.submitted = false;
  }

  formatDateToString(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-indexed in JavaScript, so add 1
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  saveOrder() {
    this.submitted = true;

    if (this.order.productName?.trim()) {
      this.order.dateAdded = this.formatDateToString(this.dateAdded);
      this.order.estimatedDelivery = this.formatDateToString(this.estimatedDelivery);

      if (this.order.orderID) {
        this.orders[this.findIndexById(this.order.orderID)] = this.order;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Updated', life: 3000 });
      } else {
        this.orders.push(this.order);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Created', life: 3000 });
      }

      this.orders = [...this.orders];
      this.orderDialog = false;
      this.order = {
        uuid: '',
        orderID: '',
        productName: '',
        status: '',
        trackingCode: '',
        estimatedDelivery: '',
        carrier: '',
        source: '',
        dateAdded: ''
      };
    }
  }

  openNew() {
    this.order = {
      uuid: '',
      orderID: '',
      productName: '',
      status: '',
      trackingCode: '',
      estimatedDelivery: '',
      carrier: '',
      source: '',
      dateAdded: ''
    };
    this.dateAdded = new Date();
    this.estimatedDelivery = new Date();
    this.submitted = false;
    this.orderDialog = true;
  }

  clear(table: Table) {
    this.selectedOrders = null;
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
  
  ngOnInit(): void {
    this.apiService.getAllUserOrders().subscribe((fetchedData: any) => {
      this.orders = fetchedData.data;
    });

    this.statuses = [
      { label: 'Pre Transit', value: 0 },
      { label: 'In Transit', value: 1 },
      { label: 'Delivered', value: 2 },
      { label: 'Returned', value: 3 }
    ]
  }
}
