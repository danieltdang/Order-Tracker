import { Component, OnInit } from '@angular/core';

interface Filter {
  name: string;
  startDate: Date;
  endDate: Date;
  custom?: boolean;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent implements OnInit {
  //chartFilter: any[] | undefined;
  reportsFilter: Filter[] | undefined;
  selectedReport: Filter | undefined;
  rangeDates: Date[] | undefined;
  today = new Date();

  daySelected: number = -1; // -1 means first date is selected, 1 means second date is selected

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
  
  // update rangeDates based on the selectedReport
  updateRangeDates(custom: boolean = false): void {
    //console.log(custom);
    if (this.selectedReport) {
      this.selectedReport.custom = custom;
    }

    if (!this.selectedReport || this.selectedReport.name === 'All Time') {
      this.rangeDates = [];
    }
    else if (this.selectedReport) {
      this.rangeDates = [this.selectedReport.startDate, this.selectedReport.endDate];
    }
  }

  onSelect(event : Date): void {
    //console.log(event);
    //console.log(this.daySelected);
    
    if (this.selectedReport) {
      if (this.daySelected === 1) {
        this.selectedReport.endDate = event;
        this.updateRangeDates(true);
      }
      else {
        this.selectedReport.startDate = event;
      }

    this.daySelected *= -1;
    }
  }

  ngOnInit() {
    this.reportsFilter = [
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
    this.selectedReport = this.reportsFilter.find(report => report.name === 'All Time');
    this.updateRangeDates();
  }
}
