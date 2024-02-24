import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private sidebarWidth = new BehaviorSubject<number>(200); // defines the width of the sidebar
  sidebarWidth$ = this.sidebarWidth.asObservable();

  setSidebarWidth(width: number) {
    this.sidebarWidth.next(width);
  }
}