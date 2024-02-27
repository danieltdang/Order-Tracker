import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
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

  toggleMobileMenu() {
    this.mobileMenuActive = !this.mobileMenuActive;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any){
    if (event.target.innerWidth > 650)
      this.mobileMenuActive = false; // close mobile menu
  }

  activeMenu(event : any) {
    let node;
    if (event.target.classList.contains("p-submenu-header") == true) {
      node = "submenu";
    } else if (event.target.tagName === "A") {
      node = event.target.parentNode.parentNode;
    } else {
      node = event.target.parentNode;
    }
    //console.log(node);
    if (node != "submenu") {
      let menuitem = document.getElementsByClassName("p-menuitem");
      for (let i = 0; i < menuitem.length; i++) {
        menuitem[i].classList.remove("active");
      }
      node.classList.add("active");
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
  }
}
