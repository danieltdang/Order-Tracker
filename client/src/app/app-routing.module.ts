import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/login/signup.component';
import { ForgotComponent } from './components/login/forgot.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmailHubComponent } from './components/email-hub/email-hub.component';
import { PackagesComponent } from './components/packages/packages.component';
import { PackageDetailComponent } from './components/packages/package-detail/package-detail.component';
import { SettingsComponent } from './components/settings/settings.component';
import { FaqComponent } from './components/faq/faq.component';

const routes: Routes = [
  { path: '',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'forgot', component: ForgotComponent },
    ]
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'email-hub', component: EmailHubComponent },
      { path: 'packages', component: PackagesComponent },
      { path: 'packages/:id', component: PackageDetailComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'faq', component: FaqComponent },
      // Redirect / to dashboard as fallback within the MainLayout
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }