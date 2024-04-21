import { Component, OnInit, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Report } from '../../interfaces/report';
import { Filter } from '../../interfaces/filter';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [DatePipe]
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

  constructor(private cdr: ChangeDetectorRef, private apiService: ApiService, private datePipe: DatePipe) { }

  updateStats() {
    if (!this.reportDates || this.reportDates.length < 2) {
      // Ensure there are start and end dates provided
      return;
    }

    const startDate = this.datePipe.transform(this.reportDates[0], 'yyyy-MM-dd') ?? '';
    const endDate = this.datePipe.transform(this.reportDates[1], 'yyyy-MM-dd') ?? '';

    this.apiService.getUserStats(startDate, endDate).then((result) => {
      if (result.status === 200) {
        console.log(result.data);
      } else {
      }
    });
  }

  formatDateToString(date: Date) {
    // Create a new Date object to avoid mutating the original date
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 1));

    //console.log(utcDate.toUTCString())
    return utcDate.toUTCString();
  }

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
          newLabels.push(this.formatChartDate(new Date(date)));
        }
        break;
      case 'Weekly':
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 7)) {
          newLabels.push(`Week of ${this.formatChartDate(new Date(date))}`);
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
    this.chartData = this.generate2DRandom(6, this.chartLabels.length);
    //console.log('Updated chart labels:', this.chartLabels);
    //console.log('Updated chart data:', this.chartData);
    this.cdr.detectChanges();
  }

  // Helper function to format dates as strings
  formatChartDate(date: Date): string {
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
  }

  // Function to update the report stats based on date range
  updateReportStats(): void {
    this.reportStats = this.generate2DRandom(2, 6);
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
        title: 'Emails',
        tooltip: 'Total emails',
        count: this.reportStats[0][1],
        icon: 'pi-envelope',
        color: 'purple',
        change: this.reportStats[1][1],
      },
      {
        title: 'Pre-Transit',
        tooltip: 'Orders being prepared in transit',
        count: this.reportStats[0][2],
        icon: 'pi-box',
        color: 'orange',
        change: this.reportStats[1][2],
      },
      {
        title: 'In Transit',
        tooltip: 'Orders that are in transit',
        count: this.reportStats[0][3],
        icon: 'pi-globe',
        color: 'yellow',
        change: this.reportStats[1][3],
      },
      {
        title: 'Out for Delivery',
        tooltip: 'Orders that are out for delivery',
        count: this.reportStats[0][4],
        icon: 'pi-map',
        color: 'green',
        change: this.reportStats[1][4],
      },
      {
        title: 'Delivered',
        tooltip: 'Orders that have been delivered',
        count: this.reportStats[0][5],
        icon: 'pi-home',
        color: 'red',
        change: this.reportStats[1][5],
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

  async ngOnInit(): Promise<void> {
    this.reportCards = [
      {
        title: 'Orders',
        tooltip: 'Total orders placed',
        count: this.reportStats?.[0]?.[0] ?? 0,
        icon: 'pi-shopping-cart',
        color: 'purple',
        change: this.reportStats?.[1]?.[0] ?? 0,
      },
      {
        title: 'Emails',
        tooltip: 'Emails for orders placed',
        count: this.reportStats?.[0]?.[1] ?? 0,
        icon: 'pi-envelope',
        color: 'orange',
        change: this.reportStats?.[1]?.[1] ?? 0,
      },
      {
        title: 'Pre-Transit',
        tooltip: 'Orders being prepared for shipment',
        count: this.reportStats?.[0]?.[2] ?? 0,
        icon: 'pi-box',
        color: 'orange',
        change: this.reportStats?.[1]?.[2] ?? 0,
      },
      {
        title: 'In Transit',
        tooltip: 'Orders that have been shipped',
        count: this.reportStats?.[0]?.[3] ?? 0,
        icon: 'pi-globe',
        color: 'yellow',
        change: this.reportStats?.[1]?.[3] ?? 0,
      },
      {
        title: 'Out for Delivery',
        tooltip: 'Orders that have been delivered',
        count: this.reportStats?.[0]?.[4] ?? 0,
        icon: 'pi-map',
        color: 'green',
        change: this.reportStats?.[1]?.[4] ?? 0,
      },
      {
        title: 'Delivered',
        tooltip: 'Orders that have been returned',
        count: this.reportStats?.[0]?.[5] ?? 0,
        icon: 'pi-home',
        color: 'red',
        change: this.reportStats?.[1]?.[5] ?? 0,
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

    this.updateStats();

    //console.log(this.reportStats);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reportStats']) {
      this.updateReportStats();
    }
  }
}