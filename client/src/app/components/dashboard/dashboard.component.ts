import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  cards: any[] | undefined;

  // Function to get the color of the change in the card
  getChangeColor(change: number, title: string): string {
    // Special case for the 'Returned' category
    if (title === 'Returned') {
      if (change > 0) {
        return 'text-red-500';
      } else if (change < 0) {
        return 'text-green-500';
      } else {
        return 'text-gray-500';
      }
    }
    // Default case for other categories
    if (change > 0) {
      return 'text-green-500';
    } else if (change < 0) {
      return 'text-red-500';
    } else {
      return 'text-gray-500';
    }
  }

  ngOnInit() {
    this.cards = [
      {
        title: 'Orders',
        tooltip: 'Total orders placed',
        count: 428,
        icon: 'pi-shopping-cart',
        color: 'blue',
        change: 74,
      },
      {
        title: 'Preparing',
        tooltip: 'Orders being prepared for shipment',
        count: 200,
        icon: 'pi-box',
        color: 'orange',
        change: 27,
      },
      {
        title: 'Shipped',
        tooltip: 'Orders that have been shipped',
        count: 127,
        icon: 'pi-globe',
        color: 'yellow',
        change: 34,
      },
      {
        title: 'Delivered',
        tooltip: 'Orders that have been delivered',
        count: 100,
        icon: 'pi-home',
        color: 'green',
        change: 0,
      },
      {
        title: 'Returned',
        tooltip: 'Orders that have been returned',
        count: 1,
        icon: 'pi-undo',
        color: 'red',
        change: 1,
      },
    ];
  }
}
