import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Filter } from '../../../interfaces/filter';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent implements OnInit {
  @Input() filterList: Filter[] | undefined;

  // Use temporary internal variables to hold the input values
  private _selectedFilter: Filter | undefined;
  private _dateStartEnd: Date[] | undefined;

  @Output() selectedFilterChange = new EventEmitter<Filter | undefined>();
  @Output() dateStartEndChange = new EventEmitter<Date[] | undefined>();

  // Proper getters and setters to intercept and emit changes
  @Input()
  get selectedFilter(): Filter | undefined {
    return this._selectedFilter;
  }
  set selectedFilter(val: Filter | undefined) {
    this._selectedFilter = val;
    this.selectedFilterChange.emit(this._selectedFilter);
  }

  @Input()
  get dateStartEnd(): Date[] | undefined {
    return this._dateStartEnd;
  }
  set dateStartEnd(val: Date[] | undefined) {
    this._dateStartEnd = val;
    this.dateStartEndChange.emit(this._dateStartEnd);
  }
  
  today = new Date();
  daySelected: number = -1; // -1 means first date is selected, 1 means second date is selected
  
  // update rangeDates based on the selectedReport
  updateRangeDates(custom: boolean = false): void {
    //console.log(custom);
    if (this.selectedFilter) {
      this.selectedFilter.custom = custom;
    }

    if (!this.selectedFilter) {// || this.selectedFilter.name === 'All Time') {
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
