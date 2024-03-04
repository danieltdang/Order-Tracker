import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenubarModule } from 'primeng/menubar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { StyleClassModule } from 'primeng/styleclass';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';

import { __decorate } from 'tslib';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './navbar/navbar.component';
import { ContentComponent } from './content/content.component';
import { DashboardComponent } from './content/dashboard/dashboard.component';
import { PackagesComponent } from './content/packages/packages.component';
import { FaqComponent } from './content/faq/faq.component';
import { SettingsComponent } from './content/settings/settings.component';
import { EmailHubComponent } from './content/email-hub/email-hub.component';
import { ChartComponentComponent } from './content/dashboard/chart-component/chart-component.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ContentComponent,
    DashboardComponent,
    PackagesComponent,
    FaqComponent,
    SettingsComponent,
    EmailHubComponent,
    ChartComponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SidebarModule,
    MenuModule,
    ButtonModule,
    CommonModule,
    RouterOutlet,
    CardModule,
    AvatarModule,
    AvatarGroupModule,
    MenubarModule,
    ToggleButtonModule,
    StyleClassModule,
    CalendarModule,
    ChartModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
