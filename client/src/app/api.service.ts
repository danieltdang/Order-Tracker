import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Order } from './interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  private ip = 'http://127.0.0.1:5001';
  private uuid = localStorage?.getItem("userID") || '12345';


  public getData() {
    return this.http.get(this.ip + '/api/data');
  }

  /*
  ##########################
  # USER RELATED ENDPOINTS #
  ##########################
  */

  public getAllUsers() {
    return this.http.get(`${this.ip}/api/users`);
  }

  public createUser(firstName: string, lastName: string, uuid: string) {
    const formData: FormData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('uuid', uuid);

    return this.http.post(`${this.ip}/api/users`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      observe: 'response'
    });
  }

  /*
  ###########################
  # ORDER RELATED ENDPOINTS #
  ###########################
  */
  public getAllUserOrders() {
    return this.http.get(`${this.ip}/api/users/${this.uuid}/orders`);
  }

  public createUserOrder(order: Order) {
    const formData: FormData = new FormData();
    formData.append('uuid', this.uuid);
    formData.append('orderID', order.orderID);
    formData.append('prodName', order.productName);
    formData.append('status', order.status);
    formData.append('trackCode', order.trackingCode);
    formData.append('estDelivery', order.estimatedDelivery);
    formData.append('carrier', order.carrier);
    formData.append('source', order.source);
    formData.append('dateAdded', order.dateAdded);

    return this.http.post(`${this.ip}/api/users/${this.uuid}/orders`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      observe: 'response'
    });
  }

  public getOrderByID(order_id: string) {
    return this.http.get(`${this.ip}/api/users/${this.uuid}/orders/${order_id}`);
  }

  /*
  ###########################
  # EMAIL RELATED ENDPOINTS #
  ###########################
  */

  public getUserEmails() {
    return this.http.get(`${this.ip}/api/users/${this.uuid}/emails`);
  }

  public getOrderEmails(order_id: string) {
    return this.http.get(`${this.ip}/api/users/${this.uuid}/orders/${order_id}/emails`);
  }

  public createOrderEmail(order_id: string, content: string, dateReceived: string) {
    const formData: FormData = new FormData();
    formData.append('content', content);
    formData.append('dateReceived', dateReceived);

    return this.http.post(`${this.ip}/api/orders/${order_id}/emails`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      observe: 'response'
    });
  }

  /*
  ############################
  # AUTHENTICATION ENDPOINTS #
  ############################
  */

  public registerUser(firstName: string, lastName: string, email: string, password: string) {
    const formData: FormData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('password', password);

    return this.http.post(`${this.ip}/auth/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      observe: 'response'
    });
  }

  public loginUser(email: string, password: string) {
    const formData: FormData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    return this.http.post(`${this.ip}/auth/login`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      observe: 'response'
    });
  }
}