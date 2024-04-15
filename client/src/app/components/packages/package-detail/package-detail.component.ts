import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.packageID = params['id'];
    })

    this.home = { icon: 'null', label: 'Packages', routerLink: '/packages' };
    this.items = [ { label: `Package #${this.packageID}` } ];
  }
}
