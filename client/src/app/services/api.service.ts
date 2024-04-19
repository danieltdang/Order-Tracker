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
  private headers = {
    "Authorization": this.AuthService.getToken()
  }

  constructor(private AuthService: AuthService, private https: HttpClient) {}

  public getData() {
    return axios.get(this.ip + '/api/data');
  }

  /* simple getter returns baseurl */
  public getBaseUrl() {
    return `${this.ip}/api/users/${this.AuthService.getUUID()}`
  }


  /* wrapper functions */
  public post(endpoint: string, payload: Object) {
    return axios.post(
      `${this.getBaseUrl()}/${endpoint}`,
      payload,
      {
        headers: this.headers
      }
    );
  }

  public async get(endpoint: string) {
    return (await axios.get(
      `${this.getBaseUrl()}/${endpoint}`,
      {
        headers: this.headers
      }
    )).data;
  }

  public put(endpoint: string, payload: Object) {
    return axios.put(
      `${this.getBaseUrl()}/${endpoint}`,
      payload,
      {
        headers: this.headers
      }
    );
  }

  public delete(endpoint: string) {
    return axios.delete(
      `${this.getBaseUrl()}/${endpoint}`,
      {
        headers: this.headers
      }
    );
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
  public async getAllUserOrders() {
    return await axios.get(`${this.ip}/api/users/${this.AuthService.getUUID()}/orders`);
  }

  public async createUserOrder(order: Order) {
    const payload = {
      senderLocation: order.senderlocation,
      receiverLocation: order.receiverlocation,
      prodName: order.productname,
      status: order.status,
      trackCode: order.trackingcode,
      estDelivery: order.estimateddelivery,
      carrier: order.carrier,
      source: order.source,
      dateAdded: order.dateadded,
    }

    return await axios.post(`${this.ip}/api/users/${this.AuthService.getUUID()}/orders`, payload)
  }

  public async updateUserOrder(order: Order) {
    const payload = {
      senderLocation: order.senderlocation,
      receiverLocation: order.receiverlocation,
      prodName: order.productname,
      status: order.status,
      trackCode: order.trackingcode,
      estDelivery: order.estimateddelivery,
      carrier: order.carrier,
      source: order.source,
      dateAdded: order.dateadded
    }

    return await axios.put(`${this.ip}/api/users/${this.AuthService.getUUID()}/orders/${order.orderid}`, payload)
  }

  public async getOrderByID(order_id: string) {
    return await axios.get(`${this.ip}/api/users/${this.AuthService.getUUID()}/orders/${order_id}`)
  }

  public async deleteUserOrder(order_id: string) {
    return await axios.delete(`${this.ip}/api/users/${this.AuthService.getUUID()}/orders/${order_id}`)
  }

  /*
  ###########################
  # EMAIL RELATED ENDPOINTS #
  ###########################
  */

  public async getUserEmails() {
    return await axios.get(`${this.ip}/api/users/${this.AuthService.getUUID()}/emails`)
  }

  public async getOrderEmails(order_id: string) {
    return await axios.get(`orders/${order_id}/emails`)
  }

  public async createOrderEmail(email: Email) {
    const payload = {
      subject: email.subject,
      status: email.status,
      order: email.order,
      content: email.content,
      source: email.source,
      dateReceived: email.datereceived
    }

    return await axios.post(`${this.ip}/api/users/${this.AuthService.getUUID()}/orders/${email.order}/emails`, payload)
  }

  public async deleteOrderEmail(email_id: string) {
    return await axios.delete(`${this.ip}/api/users/${this.AuthService.getUUID()}/emails/${email_id}`);
  }

  public async updateOrderEmail(email: Email) {
    const payload = {
      subject: email.subject,
      status: email.status,
      order: email.order,
      content: email.content,
      source: email.source,
      dateReceived: email.datereceived
    }

    return await this.put(`emails/${email.emailID}`, payload);
  }

  /*
  ##################################
  # ORDER EVENTS RELATED ENDPOINTS #
  ##################################
  */

  public async getOrderEvents(orderId: string) {
    return await this.get(`orders/${orderId}/events`);
  }

  public async createOrderEvent(event: OrderEvent) {
    const payload = {
      description: event.description,
      date: event.date
    }

    return await this.post(`orders/${event.orderID}/events`, payload);
  }

  public async deleteOrderEvents(order_id: string) {
    return await this.delete(`orders/${order_id}/events`);
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

    return await axios.delete(this.getBaseUrl(), { headers: headers });
  }
}
