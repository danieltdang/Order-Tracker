import { Component } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { PackageStatusService } from '../../services/package-status.service';
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
  providers!: any[];
  submitted: boolean = false;
  orderDialog: boolean = false;

  constructor(private apiService: ApiService, private router: Router, private statusService: PackageStatusService,
              private messageService: MessageService, private confirmationService: ConfirmationService) { }


  updateOrders() {
    this.apiService.getAllUserOrders().then((result) => {
      if (result.status === 200) {
        this.orders = result.data;
      } else {
      }
    });
  }
  
  getOrderId(index : number, order : any) {
    return order.orderID;
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.orders.length; i++) {
        if (this.orders[i].orderid === id) {
            index = i;
            break;
        }
    }

    return index;
  }

  refreshOrder(order: Order) {
    console.log("User has clicked on the refresh button for order: " + order.orderid);

    this.apiService.refreshUserOrder(order).then((result) => {
      if (result.status === 201) {
        this.updateOrders();
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Refreshed', life: 3000 });
      }
    });
  }

  editOrder(order: Order) {
    this.order = { ...order };
    this.dateAdded = new Date(order.dateadded);
    this.estimatedDelivery = new Date(order.estimateddelivery);
    this.orderDialog = true;
  }

  async deleteOrder(order: Order) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + order.productname + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            const result = await this.apiService.deleteUserOrder(order.orderid);

            if (result.status === 200) {
              this.updateOrders();
              this.order = {
                orderid: '',
                productname: '',
                status: '',
                trackingcode: '',
                estimateddelivery: '',
                carrier: '',
                source: '',
                dateadded: '',
                senderlocation: '',
                receiverlocation: ''
              };
            }
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Deleted', life: 3000 });
        }
    });
  }

  hideDialog() {
    this.orderDialog = false;
    this.submitted = false;
  }

  formatDateToString(date: Date) {
    // Create a new Date object to avoid mutating the original date
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 1));

    //console.log(utcDate.toUTCString())
    return utcDate.toUTCString();
  }

  async saveOrder() {
    this.submitted = true;
    //console.log(this.order)
    if (this.order.productname !== "" && this.order.status !== "" && this.order.trackingcode !== "" && this.order.carrier !== "" && this.order.source !== "" && this.dateAdded && this.estimatedDelivery) {
      this.order.dateadded = this.formatDateToString(this.dateAdded);
      this.order.estimateddelivery = this.formatDateToString(this.estimatedDelivery);

      if (this.order.orderid) {
        const result = await this.apiService.updateUserOrder(this.order);

        if (result.status === 201) {
          this.updateOrders();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Updated', life: 3000 });
        } else if (result.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Order Not Updated', life: 3000 });
        }
      } else {

        const result = await this.apiService.createUserOrder(this.order);
        if (result.status === 201) {
          this.updateOrders();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Created', life: 3000 });
        } else if (result.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Order Not Created', life: 3000 });
        }
      }

      this.orderDialog = false;
      this.order = {
        orderid: '',
        productname: '',
        status: '',
        trackingcode: '',
        estimateddelivery: '',
        carrier: '',
        source: '',
        dateadded: '',
        senderlocation: '',
        receiverlocation: ''
      };
    }
  }

  openNew() {
    this.order = {
      orderid: '',
      productname: '',
      status: '',
      trackingcode: '',
      estimateddelivery: '',
      carrier: '',
      source: '',
      dateadded: '',
      senderlocation: '',
      receiverlocation: ''
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
    this.router.navigate(['app/packages', event.data.orderid]);
  }

  getStatus(status: number) {
    return this.statusService.getStatus(status);
  }

  formatDate(date: string) {
    return this.statusService.formatDate(date);
  }
  
  async ngOnInit(): Promise<void> {
    this.updateOrders();

    this.statuses = [
      { label: 'Pre-Transit', value: 0 },
      { label: 'In Transit', value: 1 },
      { label: 'Out for Delivery', value: 2 },
      { label: 'Delivered', value: 3 }
    ];

    this.providers = [
      {label: 'UPS', value: 'UPS'},
      {label: 'FedEx', value: 'FedEx'},
    ];
  }
}
