import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  cards: any[] | undefined;
  
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
        count: 428,
        icon: 'pi-shopping-cart',
        color: 'blue',
        change: 74,
      },
      {
        title: 'Preparing',
        count: 200,
        icon: 'pi-box',
        color: 'orange',
        change: 27,
      },
      {
        title: 'Shipped',
        count: 127,
        icon: 'pi-globe',
        color: 'yellow',
        change: 34,
      },
      {
        title: 'Delivered',
        count: 100,
        icon: 'pi-home',
        color: 'purple',
        change: 0,
      },
      {
        title: 'Returned',
        count: 1,
        icon: 'pi-undo',
        color: 'red',
        change: 1,
      },
    ];
  }
}
