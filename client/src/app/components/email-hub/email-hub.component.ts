import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-hub',
  templateUrl: './email-hub.component.html',
  styleUrl: './email-hub.component.css'
})
export class EmailHubComponent {
  allEmails: any
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getUserEmails().subscribe((fetchedData: any) => {
      this.allEmails = fetchedData.data;
    });
  }

  goToOrder(orderID: string) {
    this.router.navigate(['app/packages', orderID]);
  }
}
