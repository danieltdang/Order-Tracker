import { Component, OnInit, ChangeDetectorRef, SimpleChanges } from '@angular/core';

import { Report } from './report';
import { Filter } from './filter';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  today = new Date();

  chartData: number[][] | undefined;
  chartFrequency: string[] | undefined;
  chartFrequencySelected: string | undefined;
  chartLabels: string[] | undefined;

  chartList: Filter[] | undefined;
  chartFilter: Filter | undefined;
  chartDates: Date[] | undefined;

  reportCards: Report[] | undefined;
  reportList: Filter[] | undefined;
  reportFilter: Filter | undefined;
  reportDates: Date[] | undefined;
  reportStats: number[][] | undefined;

  constructor(private cdr: ChangeDetectorRef) { }

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

  // Function to update the chart labels based on frequency and date range
  updateChartLabels(): void {
    if (!this.chartDates || this.chartDates.length < 2) {
      // Ensure there are start and end dates provided
      return;
    }
  
    const startDate = this.chartDates[0];
    const endDate = this.chartDates[1];
    const newLabels: string[] = []; // Create a new array
  
    switch (this.chartFrequencySelected) {
      case 'Daily':
        // Adjust endDate to the end of the day, otherwise current day will be excluded
        let adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);
        
        // Generate labels for each day between startDate and adjustedEndDate
        for (let date = new Date(startDate); date <= adjustedEndDate; date.setDate(date.getDate() + 1)) {
          newLabels.push(this.formatDate(new Date(date)));
        }
        break;
      case 'Weekly':
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 7)) {
          newLabels.push(`Week of ${this.formatDate(new Date(date))}`);
        }
        break;
      case 'Monthly':
        for (let date = new Date(startDate.getFullYear(), startDate.getMonth(), 1); date <= endDate; date.setMonth(date.getMonth() + 1)) {
          newLabels.push(`${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`);
        }
        break;
      case 'Yearly':
        for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
          newLabels.push(`${year}`);
        }
        break;
      default:
        console.warn(`Unexpected frequency: ${this.chartFrequencySelected}`);
    }
  
    this.chartLabels = newLabels; // Assign the new array to chartLabels
    this.chartData = this.generate2DRandom(5, this.chartLabels.length);
    //console.log('Updated chart labels:', this.chartLabels);
    //console.log('Updated chart data:', this.chartData);
    this.cdr.detectChanges();
  }

  // Helper function to format dates as strings
  formatDate(date: Date): string {
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
  }

  // Function to update the report stats based on date range
  updateReportStats(): void {
    this.reportStats = this.generate2DRandom(2, 5);
    //console.log('Updated report stats:', this.reportStats);
    
    if (!this.reportStats) {
      // Ensure there are start and end dates provided
      //console.log('No stats provided')
      return;
    }
  
    //const startDate = this.reportDates[0];
    //const endDate = this.reportDates[1];
  
    this.reportCards = [
      {
        title: 'Orders',
        tooltip: 'Total orders placed',
        count: this.reportStats[0][0],
        icon: 'pi-shopping-cart',
        color: 'blue',
        change: this.reportStats[1][0],
      },
      {
        title: 'Preparing',
        tooltip: 'Orders being prepared for shipment',
        count: this.reportStats[0][1],
        icon: 'pi-box',
        color: 'orange',
        change: this.reportStats[1][1],
      },
      {
        title: 'Shipped',
        tooltip: 'Orders that have been shipped',
        count: this.reportStats[0][2],
        icon: 'pi-globe',
        color: 'yellow',
        change: this.reportStats[1][2],
      },
      {
        title: 'Delivered',
        tooltip: 'Orders that have been delivered',
        count: this.reportStats[0][3],
        icon: 'pi-home',
        color: 'green',
        change: this.reportStats[1][3],
      },
      {
        title: 'Returned',
        tooltip: 'Orders that have been returned',
        count: this.reportStats[0][4],
        icon: 'pi-undo',
        color: 'red',
        change: this.reportStats[1][4],
      },
    ];

    // This assignment creates a new reference for reportCards array which will trigger Angular's change detection
    this.reportCards = [...this.reportCards];
    this.cdr.detectChanges();
  }

  onChartFrequencyChange(newFrequency: string): void {
    this.chartFrequencySelected = newFrequency;
    this.updateChartLabels();
  }

  onChartFilterChange(newFilter: Filter | undefined): void {
    this.chartFilter = newFilter;
    this.updateChartLabels();
  }

  onChartDatesChange(newDates: Date[] | undefined): void {
    this.chartDates = newDates;
    this.updateChartLabels();
    this.cdr.detectChanges();
  }

  onReportFilterChange(newFilter: Filter | undefined): void {
    this.reportFilter = newFilter;
    this.updateReportStats();
    // Handle report filter change logic here
  }

  onReportDatesChange(newDates: Date[] | undefined): void {
    this.reportDates = newDates;
    this.updateReportStats();
    this.cdr.detectChanges();
    // Handle report date change logic here
  }

  generate1DRandom(arrayLength: number): number[] {
    const arr: number[] = [];
    for (let j = 0; j < arrayLength; j++) {
      // Generate a random number between 0 and 40
      const randomNumber = Math.floor(Math.random() * 41);
      arr.push(randomNumber);
    }
  
    return arr;
  }

  generate2DRandom(numArrays: number, arrayLength: number): number[][] {
    const arrays: number[][] = [];
  
    for (let i = 0; i < numArrays; i++) {
      const arr: number[] = [];
      for (let j = 0; j < arrayLength; j++) {
        // Generate a random number between 0 and 40
        const randomNumber = Math.floor(Math.random() * 41);
        arr.push(randomNumber);
      }
      arrays.push(arr);
    }
  
    return arrays;
  }

  ngOnInit() {
    this.reportCards = [
      {
        title: 'Orders',
        tooltip: 'Total orders placed',
        count: this.reportStats?.[0]?.[0] ?? 0,
        icon: 'pi-shopping-cart',
        color: 'blue',
        change: this.reportStats?.[1]?.[0] ?? 0,
      },
      {
        title: 'Preparing',
        tooltip: 'Orders being prepared for shipment',
        count: this.reportStats?.[0]?.[1] ?? 0,
        icon: 'pi-box',
        color: 'orange',
        change: this.reportStats?.[1]?.[1] ?? 0,
      },
      {
        title: 'Shipped',
        tooltip: 'Orders that have been shipped',
        count: this.reportStats?.[0]?.[2] ?? 0,
        icon: 'pi-globe',
        color: 'yellow',
        change: this.reportStats?.[1]?.[2] ?? 0,
      },
      {
        title: 'Delivered',
        tooltip: 'Orders that have been delivered',
        count: this.reportStats?.[0]?.[3] ?? 0,
        icon: 'pi-home',
        color: 'green',
        change: this.reportStats?.[1]?.[3] ?? 0,
      },
      {
        title: 'Returned',
        tooltip: 'Orders that have been returned',
        count: this.reportStats?.[0]?.[4] ?? 0,
        icon: 'pi-undo',
        color: 'red',
        change: this.reportStats?.[1]?.[4] ?? 0,
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
        startDate: new Date(new Date(0).setFullYear(1999)), // SHOULD BE SET TO USER'S FIRST ORDER DATE
        endDate: this.today,
      },
    ];

    // Set the default selectedReport to 'All Time'
    this.reportFilter = this.reportList.find(filter => filter.name === 'All Time');

    // For now, chartList is exact same as Report List
    this.chartList = this.reportList;
    this.chartFilter = this.chartList.find(filter => filter.name === 'All Time');

    this.chartFrequency = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    this.chartFrequencySelected = this.chartFrequency[3];

    this.updateReportStats();
    this.updateChartLabels();

    //console.log(this.reportStats);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reportStats']) {
      this.updateReportStats();
    }
  }
}