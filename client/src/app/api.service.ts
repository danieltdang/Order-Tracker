import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  private ip = 'http://127.0.0.1:5001/';
  private userID = '312331'

  public getData() {
    return this.http.get(this.ip + 'api/data');
  }

  public getOrders() {
    return this.http.get(`${this.ip}/api/users/${this.userID}/orders`);
  }

  public getOrderByID(order_id: String) {
    return this.http.get(`${this.ip}/api/users/${this.userID}/orders/${order_id}`);
  }

  public getEmails() {
    return this.http.get(`${this.ip}/api/users/${this.userID}/emails`);
  }
}