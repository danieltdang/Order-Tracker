import { Component, OnInit, Input } from '@angular/core';

import { Filter } from '../filter';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent implements OnInit {
  @Input() filterList: Filter[] | undefined;
  @Input() selectedFilter: Filter | undefined;
  @Input() dateStartEnd: Date[] | undefined;
  today = new Date();
  daySelected: number = -1; // -1 means first date is selected, 1 means second date is selected
  
  // update rangeDates based on the selectedReport
  updateRangeDates(custom: boolean = false): void {
    //console.log(custom);
    if (this.selectedFilter) {
      this.selectedFilter.custom = custom;
    }

    if (!this.selectedFilter || this.selectedFilter.name === 'All Time') {
      this.dateStartEnd = [];
    }
    else if (this.selectedFilter) {
      this.dateStartEnd = [this.selectedFilter.startDate, this.selectedFilter.endDate];
    }
  }

  onSelect(event : Date): void {
    //console.log(event);
    //console.log(this.daySelected);
    
    if (this.selectedFilter) {
      if (this.daySelected === 1) {
        this.selectedFilter.endDate = event;
        this.updateRangeDates(true);
      }
      else {
        this.selectedFilter.startDate = event;
      }

    this.daySelected *= -1;
    }
  }

  ngOnInit() {
    this.updateRangeDates();
  }
}
