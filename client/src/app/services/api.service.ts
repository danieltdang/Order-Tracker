import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';
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
  private permissions!: boolean;

  private async initialize(): Promise<void> {
    const result = await axios.get(`${this.ip}/api/users/${this.AuthService.getUUID()}/name-email`);

    this.name = result.data.firstname + " " + result.data.lastname;
    this.firstLetter = this.name.charAt(0);
    this.email = result.data.email;
    
    const response = await axios.get(`${this.ip}/api/users/${this.AuthService.getUUID()}/email_permission`);
    this.permissions = response.data.permissions;
    this.AuthService.setPermission(this.permissions);
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
  public async post(endpoint: string, payload: Object, config?: AxiosRequestConfig) {
    return await axios.post(
      `${this.getBaseUrl()}/${endpoint}`,
      payload,
      <AxiosRequestConfig>{
        headers: this.headers,
        ...config,
      }
    );
  }

  public async get(endpoint: string, config?: AxiosRequestConfig) {
    return await axios.get(
      `${this.getBaseUrl()}/${endpoint}`,
      <AxiosRequestConfig>{
        headers: this.headers,
        ...config,
      }
    );
  }

  public async put(endpoint: string, payload: Object, config?: AxiosRequestConfig) {
    return await axios.put(
      `${this.getBaseUrl()}/${endpoint}`,
      payload, 
      <AxiosRequestConfig>{
        headers: this.headers,
        ...config,
      }
    );
  }

  public async delete(endpoint: string, config?: AxiosRequestConfig) {
    return await axios.delete(
      `${this.getBaseUrl()}/${endpoint}`,
      <AxiosRequestConfig>{
        headers: this.headers,
        ...config
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

  public async getPermission() {
    return this.permissions;
  }

  public async getPremium() {
    return await this.get('email_permission');
  }

  public async updatePremium(isPremium: boolean) {
    const config: AxiosRequestConfig = {
      params: {
        premium: isPremium
      }
    }

    return await this.get('update_premium', config);
  }

  /*
  ###################
  # STATS ENDPOINTS #
  ###################
  */
  public async getAllUserStats() {
    return await this.get('stats');
  }

  public async getUserStats(startDate: string, endDate: string) {
    const config: AxiosRequestConfig = {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    }

    return await this.get('stats', config);
  }

  public async getUserChartStats(startDate: string[], endDate: string[]) {
    const config: AxiosRequestConfig = {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    }

    return await this.get('stats/chart', config);
  }

  /*
  ###########################
  # ORDER RELATED ENDPOINTS #
  ###########################
  */
  public async getAllUserOrders() {
    return await this.get('orders');
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

    return await this.post('orders', payload)
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

    return await this.put(`orders/${order.orderid}`, payload)
  }

  public async getOrderByID(order_id: string) {
    return await this.get(`orders/${order_id}`)
  }

  public async deleteUserOrder(order_id: string) {
    return await this.delete(`orders/${order_id}`)
  }

  /*
  ###########################
  # EMAIL RELATED ENDPOINTS #
  ###########################
  */

  public async getUserEmails() {
    return await this.get('emails')
  }

  public async getOrderEmails(order_id: string) {
    return await this.get(`orders/${order_id}/emails`)
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

    return await this.post(`orders/${email.order}/emails`, payload)
  }

  public async deleteOrderEmail(email_id: string) {
    return await this.delete(`emails/${email_id}`);
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

  public async getOrderIDs() {
    return await this.get(`orders/ids`);
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
    const payload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    }

    return await axios.post(`${this.ip}/auth/register`, payload);
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

    return await axios.post(`${this.ip}/auth/change-password`, payload, { headers });
  }

  public async deleteUser() {
    const headers = {
      "Authorization": this.AuthService.getToken()
    }

    // since base url leads to user, we can use the function by itself as the URL
    return await axios.delete(this.getBaseUrl(), { headers });
  }
}
