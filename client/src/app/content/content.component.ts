import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

  orders: any;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getOrders().subscribe((fetchedData) => {
      this.orders = fetchedData;
    });
  }
}
