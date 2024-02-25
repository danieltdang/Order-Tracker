import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.items = [{
        label: 'Hello Example User!',
        items: [
          {label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/dashboard']},
          {label: 'Email Hub', icon: 'pi pi-envelope', routerLink: ['/email-hub']},
          {label: 'Packages', icon: 'pi pi-download', routerLink: ['/pagename']}, //queryParams: {'recent': 'true'}}
          {label: 'Settings', icon: 'pi pi-cog', routerLink: ['/settings']},
          {label: 'FAQ', icon: 'pi pi-question-circle', routerLink: ['/faq']},
        ]
    }];
  }
}
