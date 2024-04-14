import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.css'
})
export class PackageDetailComponent implements OnInit {
  packageID: string | undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.packageID = params['id'];
      console.log('Package ID:', this.packageID);
    })
  };
}
