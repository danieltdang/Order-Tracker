import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] | undefined;
  mobileMenuActive: boolean = false;

  // Subscribe to router events to detect navigation changes
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.mobileMenuActive = !this.mobileMenuActive;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any){
    if (event.target.innerWidth > 650)
      this.mobileMenuActive = false; // close mobile menu
  }

  updateActiveMenu() {
    if (this.items) {
      // Loop through menu items and set 'active' based on current route
      this.items.forEach(item => {
        if (this.router.url === item.routerLink[0]) {
          item.styleClass = 'active';
        } else {
          item.styleClass = '';
        }
      });
    }
  }

  ngOnInit() {
    this.items = [
      {label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/dashboard'], styleClass : 'active'},
      {label: 'Email Hub', icon: 'pi pi-envelope', routerLink: ['/email-hub']},
      {label: 'Packages', icon: 'pi pi-download', routerLink: ['/packages']}, //queryParams: {'recent': 'true'}}
      {label: 'Settings', icon: 'pi pi-cog', routerLink: ['/settings']},
      {label: 'FAQ', icon: 'pi pi-question-circle', routerLink: ['/faq']},
    ];

    this.updateActiveMenu();
  }
}
