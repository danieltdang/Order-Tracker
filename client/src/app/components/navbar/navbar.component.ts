import { AfterViewInit, Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit, AfterViewInit {
  items: MenuItem[] | undefined;
  mobileMenuActive: boolean = false;
  userName!: string;
  firstLetter!: string;

  // Subscribe to router events to detect navigation changes
  constructor(private router: Router, private authService: AuthService, private apiService: ApiService) {
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
      // Get the base URL by splitting the current URL at slashes and considering the situation for root path
      const currentUrlParts = this.router.url.split('/');
      const baseUrl = currentUrlParts.slice(0, 3).join('/');
  
      // Loop through menu items and set 'active' based on current route
      this.items.forEach(item => {
        if (item.routerLink === undefined) 
          return;

        if (item.routerLink[0] === '/') {
          // Check if the current URL is exactly '/' for the root path
          item.styleClass = this.router.url === '/' ? 'active' : '';
        } else {
          // Use startsWith for other paths and ensure that the base URL matches the routerLink
          item.styleClass = baseUrl.startsWith(item.routerLink[0]) ? 'active' : '';
        }
      });
    }
  }

  signOut() {
    this.router.navigate(['/']);
    this.authService.logout();
  }

  async updateUser() {
    this.userName = await this.apiService.getName();
    this.firstLetter = await this.apiService.getFirstLetter();
  }

  async ngOnInit(): Promise<void> {
    this.items = [
      {label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/app/dashboard'], styleClass : 'active'},
      {label: 'Email Hub', icon: 'pi pi-envelope', routerLink: ['/app/email-hub']},
      {label: 'Packages', icon: 'pi pi-box', routerLink: ['/app/packages']}, //queryParams: {'recent': 'true'}}
      {label: 'Settings', icon: 'pi pi-cog', routerLink: ['/app/settings']},
      {label: 'FAQ', icon: 'pi pi-question-circle', routerLink: ['/app/faq']},
      {label: 'Sign Out', icon: 'pi pi-sign-out', command: () => this.signOut()}
    ];

    this.updateActiveMenu();

    // set user's name
  }

  ngAfterViewInit() : void {
    this.updateUser();
  }
}
