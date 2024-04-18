import { Component } from '@angular/core';
import { Email } from '../../../interfaces/email';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-viewer',
  templateUrl: './email-viewer.component.html',
  styleUrl: './email-viewer.component.css'
})
export class EmailViewerComponent {
  email!: Email;

  constructor(private router: Router) { }

  goToOrder(orderID: string) {
    this.router.navigate(['app/packages', orderID]);
  }
}
