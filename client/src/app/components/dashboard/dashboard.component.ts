import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  cards: any[] | undefined;
  chartFilter: any[] | undefined;
  reportsFilter: any[] | undefined;
  today = new Date();

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

  getStartDateOfTheWeek = (date: Date) => {
    const dayOfWeek = date.getDay(); // Get current day of the week, 0 (Sunday) to 6 (Saturday)
    return new Date(date.setDate(date.getDate() - dayOfWeek));
  };

  getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  getFirstDayOfTheYear = (date: Date) => {
    return new Date(date.getFullYear(), 0, 1);
  };

  formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
  };

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

    this.reportsFilter = [
      {
        name: 'Yesterday',
        startDate: this.formatDate(new Date(new Date().setDate(new Date().getDate() - 1))),
        endDate: this.formatDate(this.today),
      },
      {
        name: 'This Week',
        startDate: this.formatDate(this.getStartDateOfTheWeek(this.today)),
        endDate: this.formatDate(this.today),
      },
      {
        name: 'This Month',
        startDate: this.formatDate(this.getFirstDayOfMonth(this.today)),
        endDate: this.formatDate(this.today),
      },
      {
        name: 'Past 3 Months',
        startDate: this.formatDate(this.getFirstDayOfMonth(new Date(new Date().setMonth(this.today.getMonth() - 3)))),
        endDate: this.formatDate(this.today),
      },
      {
        name: 'Past 6 Months',
        startDate: this.formatDate(this.getFirstDayOfMonth(new Date(new Date().setMonth(this.today.getMonth() - 6)))),
        endDate: this.formatDate(this.today),
      },
      {
        name: 'This Year',
        startDate: this.formatDate(this.getFirstDayOfTheYear(this.today)),
        endDate: this.formatDate(this.today),
      },
      { 
        name: 'All Time',
        startDate: null,
        endDate: null
      },
    ];
  }
}
