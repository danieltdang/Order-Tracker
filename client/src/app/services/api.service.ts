import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

import { Order } from '../interfaces/order';
import { Email } from '../interfaces/email';
import { OrderEvent } from '../interfaces/events';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private ip = 'http://127.0.0.1:5001';

  constructor(private AuthService: AuthService, private https: HttpClient) {}

  public getData() {
    return axios.get(this.ip + '/api/data');
  }

  /*
  ##########################
  # USER RELATED ENDPOINTS #
  ##########################
  */

  public async getAllUsers() {
    return await axios.get(`${this.ip}/api/users`);
  }

  public async createUser(firstName: string, lastName: string, uuid: string) {
    const payload = {
      firstName: firstName,
      lastName: lastName,
      uuid: uuid
    }

    return await axios.post(`${this.ip}/api/users`, payload);
  }

  /*
  ###########################
  # ORDER RELATED ENDPOINTS #
  ###########################
  */
  public getAllUserOrders() {
    return this.https.get(`${this.ip}/api/users/${this.AuthService.getUUID()}/orders`);
  }

  public createUserOrder(order: Order) {
    const payload = {
      senderLocation: "",
      receiverLocation: "",
      prodName: order.productName,
      status: order.status,
      trackCode: order.trackingCode,
      estDelivery: order.estimatedDelivery,
      carrier: order.carrier,
      source: order.source,
      dateAdded: order.dateAdded
    }

    const headers = {
      "Authorization": this.AuthService.getToken()
    }

    return axios.post(`${this.ip}/api/users/${this.AuthService.getUUID()}/orders`, payload, {headers: headers});
  }

  public updateUserOrder(order: Order) {
    const payload = {
      senderLocation: order.senderLocation,
      receiverLocation: order.receiverLocation,
      prodName: order.productName,
      status: order.status,
      trackCode: order.trackingCode,
      estDelivery: order.estimatedDelivery,
      carrier: order.carrier,
      source: order.source,
      dateAdded: order.dateAdded
    }

    const headers = {
      "Authorization": this.AuthService.getToken()
    }

    return axios.put(`${this.ip}/api/users/${this.AuthService.getUUID()}/orders/${order.orderID}`, payload, {headers: headers});
  }

  public getOrderByID(order_id: string) {
    return this.https.get(`${this.ip}/api/users/${this.AuthService.getUUID()}/orders/${order_id}`);
  }

  public deleteUserOrder(order_id: string) {
    const headers = {
      "Authorization": this.AuthService.getToken()
    }

    return axios.delete(`${this.ip}/api/users/${this.AuthService.getUUID()}/orders/${order_id}`, { headers: headers });
  }

  /*
  ###########################
  # EMAIL RELATED ENDPOINTS #
  ###########################
  */

  public getUserEmails() {
    return this.https.get(`${this.ip}/api/users/${this.AuthService.getUUID()}/emails`);
  }

  public getOrderEmails(order_id: string) {
    return axios.get(`${this.ip}/api/users/${this.AuthService.getUUID()}/orders/${order_id}/emails`);
  }

  public createOrderEmail(email: Email) {
    const payload = {
      content: email.content,
      dateReceived: email.dateReceived
    }

    return axios.post(`${this.ip}/api/users/${this.AuthService.getUUID()}/orders/${email.order}/emails`, payload);
  }

  public deleteOrderEmail(email_id: string) {
    // /api/users/<uuid>/emails/<email_id>
    return axios.delete(`${this.ip}/api/users/${this.AuthService.getUUID()}/emails/${email_id}`);
  }

  public updateOrderEmail(email: Email) {
    const payload = {
      content: email.content,
      dateReceived: email.dateReceived
    }

    return axios.put(`${this.ip}/api/users/${this.AuthService.getUUID()}/emails/${email.emailID}`, payload);
  }

  /*
  ##################################
  # ORDER EVENTS RELATED ENDPOINTS #
  ##################################
  */

  public getOrderEvents(orderId: string) {
    return this.https.get(
      `${this.ip}/api/users/${this.AuthService.getUUID()}/orders/${orderId}/events`
    );
  }

  public createOrderEvent(event: OrderEvent) {
    const payload = {
      description: event.description,
      date: event.date
    }

    return axios.post(
      `${this.ip}/api/users/${this.AuthService.getUUID()}/orders/${event.orderID}/events`,
      payload
    );
  }

  public deleteOrderEvents(order_id: string) {
    // /api/users/<uuid>/emails/<email_id>
    return axios.delete(
      `${this.ip}/api/users/${this.AuthService.getUUID()}/orders/${order_id}/events`
    );
  }

  /*
  ############################
  # AUTHENTICATION ENDPOINTS #
  ############################
  */

  public async registerUser(firstName: string, lastName: string, email: string, password: string) {
   
    const Payload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    }

    return await axios.post(`${this.ip}/auth/register`, Payload);
  }

  public async loginUser(email: string, password: string) {
    const payload = {
      email: email,
      password: password
    }

    return await axios.post(`${this.ip}/auth/login`, payload);
  }

  public async changePassword(oldPassword: string, newPassword: string) {
    const payload = {
      uuid: this.AuthService.getUUID(),
      oldPassword: oldPassword,
      newPassword: newPassword
    }

    const headers = {
      "Authorization": this.AuthService.getToken()
    }

    return await axios.post(`${this.ip}/auth/change-password`, payload, { headers: headers });
  }

  public async deleteUser() {
    const headers = {
      "Authorization": this.AuthService.getToken()
    }

    return await axios.delete(`${this.ip}/api/users/${this.AuthService.getUUID()}`, { headers: headers });
  }
}
