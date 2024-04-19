import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PackageStatusService } from '../../../services/package-status.service';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.css'
})
export class PackageDetailComponent implements OnInit {
  packageID: string | undefined;
  order : any;
  details!: any[];
  isLoading = true;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private statusService: PackageStatusService,
              private router: Router) { }

  getStatus(status: number) {
    return this.statusService.getStatus(status);
  }

  formatDate(date: string) {
    return this.statusService.formatDate(date);
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.packageID = params['id'];
      try {
        this.order = (await this.apiService.getOrderByID(params['id'])).data
        this.isLoading = false;

        this.details = [
          { label: 'Status', value: this.getStatus(this.order?.status) },
          { label: 'Tracking Code', value: this.order?.trackingCode },
          { label: 'Carrier', value: this.order?.carrier },
          { label: 'Source', value: this.order?.source },
          { label: 'Sender Location', value: this.order?.senderLocation },
          { label: 'Receiver Location', value: this.order?.receiverLocation },
          { label: 'Date Added', value: this.formatDate(this.order?.dateAdded) },
          { label: 'Estimated Delivery', value: this.formatDate(this.order?.estimatedDelivery) },
        ];
      }
      catch (e) {
        this.details = [
          { label: 'Status', value: this.getStatus(this.order?.status) },
          { label: 'Tracking Code', value: this.order?.trackingCode },
          { label: 'Carrier', value: this.order?.carrier },
          { label: 'Source', value: this.order?.source },
          { label: 'Sender Location', value: this.order?.senderLocation },
          { label: 'Receiver Location', value: this.order?.receiverLocation },
          { label: 'Date Added', value: this.formatDate(this.order?.dateAdded) },
          { label: 'Estimated Delivery', value: this.formatDate(this.order?.estimatedDelivery) },
        ];
        throw e
      }
    });
  } 
}
