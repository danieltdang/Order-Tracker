import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PackageStatusService {
  private statusMappings: { [key: number]: string } = {
    0: 'Pre-Transit',
    1: 'In Transit',
    2: 'Out for Delivery',
    3: 'Delivered'
  };

  constructor() { }

  getStatus(statusCode: number): string {
    return this.statusMappings[statusCode] || 'Unknown';
  }

  formatDate(inputString: string): string {
    const date = new Date(inputString);
  
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
  
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}
