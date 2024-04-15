import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PackageStatusService } from '../package-status.service';
import { ApiService } from '../../../api.service';

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.css'
})
export class PackageDetailComponent implements OnInit {
  packageID: string | undefined;
  order : any;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private statusService: PackageStatusService) { }

  getStatus(status: number) {
    return this.statusService.getStatus(status);
  }

  formatDate(date: string) {
    return this.statusService.formatDate(date);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.packageID = params['id'];
      this.apiService.getOrderByID(params['id']).subscribe((fetchedData: any) => {
        this.order = fetchedData;
      });
      
    })
    
  }
}
