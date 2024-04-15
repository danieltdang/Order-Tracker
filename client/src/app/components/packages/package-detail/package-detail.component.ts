import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { PackageStatusService } from '../package-status.service';
import { ApiService } from '../../../api.service';

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.css'
})
export class PackageDetailComponent implements OnInit {
  home: MenuItem | undefined;
  items: MenuItem[] | undefined;
  packageID: string | undefined;
  order : any;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private statusService: PackageStatusService) { }

  getStatus(status: number) {
    return this.statusService.getStatus(status);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.packageID = params['id'];
      this.items = [ { label: `Package #${this.packageID}` } ];
      this.apiService.getOrderByID(params['id']).subscribe((fetchedData: any) => {
        this.order = fetchedData;
      });
      
    })

    this.home = { icon: 'null', label: 'Packages', routerLink: '/packages' };
    
  }
}
