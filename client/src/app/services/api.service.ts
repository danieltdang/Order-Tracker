import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service';

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
  private name!: string;
  private firstLetter!: string;
  private email!: string;
  private role!: string;
  private permissions!: boolean;

  private async initialize(): Promise<void> {
    const result = await axios.get(`${this.ip}/api/users/${this.AuthService.getUUID()}/name-email`);

    this.name = result.data.firstname + " " + result.data.lastname;
    this.firstLetter = this.name.charAt(0);
    this.email = result.data.email;
    const response = await axios.get(`${this.ip}/api/users/${this.AuthService.getUUID()}/role`);
    this.role = response.data[0].role;
    this.permissions = response.data[1];
    this.AuthService.setRole(this.role);
    this.AuthService.setPermission(this.permissions);
    console.log("User Role:", this.role);
    console.log("User Email Permission:", this.permissions);
  }

  constructor(private AuthService: AuthService) {
  }

  public getData() {
    return axios.get(this.ip + '/api/data');
  }

  /* simple getter returns baseurl */
  public getBaseUrl() {
    return `${this.ip}/api/users/${this.AuthService.getUUID()}`
  }


  /* wrapper functions */
  /*
  these funcs avoid the boilerplate of adding the baseurl and auth headers
  */
  public async post(endpoint: string, payload: Object) {
    return await axios.post(
      `${this.getBaseUrl()}/${endpoint}`,
      payload,
      {
        headers: this.headers
      }
    );
  }

  public async get(endpoint: string) {
    return await axios.get(
      `${this.getBaseUrl()}/${endpoint}`,
      {
        headers: this.headers
      }
    );
  }

  public async put(endpoint: string, payload: Object) {
    return await axios.put(
      `${this.getBaseUrl()}/${endpoint}`,
      payload,
      {
        headers: this.headers
      }
    );
  }

  public async delete(endpoint: string) {
    return await axios.delete(
      `${this.getBaseUrl()}/${endpoint}`,
      {
        headers: this.headers
      }
    );
  }
   /*
  ##################
  # USER ENDPOINTS #
  ##################
  */

  public async getName() {
    if (!this.name) {
      await this.initialize();
    }
    
    return this.name;
  }

  public async getFirstLetter() {
    if (!this.firstLetter) {
      await this.initialize();
    }

    return this.firstLetter;
  }

  public async getEmail() {
    return this.email;
  }

  public async getRole() {
    return this.role;
  }

  public async getPermission() {
    return this.permissions;
  }

  /*
  ###################
  # STATS ENDPOINTS #
  ###################
  */
  public async getAllUserStats() {

    return await axios.get(`${this.ip}/api/users/${this.AuthService.getUUID()}/stats`);
  }

  public async getUserStats(startDate: string, endDate: string) {
    const payload = {
      startDate: startDate,
      endDate: endDate
    }

    return await axios.get(`${this.ip}/api/users/${this.AuthService.getUUID()}/stats`, { params: payload });
  }

  public async getUserChartStats(startDate: string[], endDate: string[]) {
    const payload = {
      startDate: startDate,
      endDate: endDate
    }

    return await axios.get(`${this.ip}/api/users/${this.AuthService.getUUID()}/stats/chart`, { params: payload });
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

    return await axios.put(`${this.ip}/api/users/${this.AuthService.getUUID()}/emails/${email.emailID}`, payload);
  }

  /*
  ##################################
  # ORDER EVENTS RELATED ENDPOINTS #
  ##################################
  */

  public async getOrderIDs() {
    return await axios.get(`${this.ip}/api/users/${this.AuthService.getUUID()}/orders/ids`);
  }

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

  public async refreshUserOrder(order: Order) {
    return await this.post(`orders/${order.orderid}/refresh`, {});
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
