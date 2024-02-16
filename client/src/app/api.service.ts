import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  private ip = 'http://127.0.0.1:5001/';

  public getData() {
    return this.http.get(this.ip + 'api/data');
  }

  public getOrders() {
    return this.http.get(this.ip + 'api/getOrders');
  }
}