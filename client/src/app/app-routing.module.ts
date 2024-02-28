import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './content/dashboard/dashboard.component';
import { EmailHubComponent } from './content/email-hub/email-hub.component';
import { PackagesComponent } from './content/packages/packages.component';
import { SettingsComponent } from './content/settings/settings.component';
import { FaqComponent } from './content/faq/faq.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'email-hub', component: EmailHubComponent },
  { path: 'packages', component: PackagesComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'faq', component: FaqComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
