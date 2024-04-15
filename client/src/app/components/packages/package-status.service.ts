import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PackageStatusService {
  private statusMappings: { [key: number]: string } = {
    0: 'Pre Transit',
    1: 'In Transit',
    2: 'Delivered',
    3: 'Returned'
  };

  constructor() { }

  getStatus(statusCode: number): string {
    return this.statusMappings[statusCode] || 'Unknown';
  }
}
