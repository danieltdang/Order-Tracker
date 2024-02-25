import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, } from 'rxjs';
import { ViewportRuler } from '@angular/cdk/scrolling';

const MIN_WIDTH = 200;
const PERCENT_WIDTH = 0.15;

@Injectable({
  providedIn: 'root',
})
export class UiService implements OnDestroy {
  private sidebarWidth = new BehaviorSubject<number>(MIN_WIDTH);
  sidebarWidth$ = this.sidebarWidth.asObservable();

  private readonly viewportChange = this.viewportRuler
    .change(200)
    .subscribe(() => this.ngZone.run(() => this.setSidebarWidth(Math.max(MIN_WIDTH, this.viewportRuler.getViewportSize().width * PERCENT_WIDTH))));
  
  constructor(
    private readonly viewportRuler: ViewportRuler,
    private readonly ngZone: NgZone
  ) {
    // Set initial sidebar width
    this.setSidebarWidth(Math.max(MIN_WIDTH, this.viewportRuler.getViewportSize().width * PERCENT_WIDTH));
  }

  ngOnDestroy() {
    this.viewportChange.unsubscribe();
  }

  setSidebarWidth(width: number) {
    this.sidebarWidth.next(width);
  }
}