import { Component, OnInit } from '@angular/core';

import { Filter } from './filter';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  cards: any[] | undefined;
  today = new Date();

  chartList: Filter[] | undefined;
  chartFilter: Filter | undefined;
  chartDates: Date[] | undefined;

  reportList: Filter[] | undefined;
  reportFilter: Filter | undefined;
  reportDates: Date[] | undefined;

  getStartDateOfTheWeek = (date: Date) => {
    const newDate = new Date();
    newDate.setDate(date.getDate() - date.getDay());

    return newDate;
  };

  getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  getFirstDayOfTheYear = (date: Date) => {
    return new Date(date.getFullYear(), 0, 1);
  };

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

    this.reportList = [
      {
        name: 'Yesterday',
        startDate: new Date(new Date().setDate(this.today.getDate() - 1)),
        endDate: this.today,
      },
      {
        name: 'This Week',
        startDate: this.getStartDateOfTheWeek(this.today),
        endDate: this.today,
      },
      {
        name: 'This Month',
        startDate: this.getFirstDayOfMonth(this.today),
        endDate: this.today,
      },
      {
        name: 'Past 3 Months',
        startDate: this.getFirstDayOfMonth(new Date(new Date().setMonth(this.today.getMonth() - 3))),
        endDate: this.today,
      },
      {
        name: 'Past 6 Months',
        startDate: this.getFirstDayOfMonth(new Date(new Date().setMonth(this.today.getMonth() - 6))),
        endDate: this.today,
      },
      {
        name: 'This Year',
        startDate: this.getFirstDayOfTheYear(this.today),
        endDate: this.today,
      },
      { 
        name: 'All Time',
        startDate: new Date(0), // SHOULD BE SET TO USER'S FIRST ORDER DATE
        endDate: this.today,
      },
    ];

    // Set the default selectedReport to 'All Time'
    this.reportFilter = this.reportList.find(filter => filter.name === 'All Time');

    // For now, chartList is exact same as Report List
    this.chartList = this.reportList;
    this.chartFilter = this.chartList.find(filter => filter.name === 'All Time');
  }
}
