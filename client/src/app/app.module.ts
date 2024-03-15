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
import { CheckboxModule } from 'primeng/checkbox';
import { ImageModule } from 'primeng/image';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

import { __decorate } from 'tslib';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/navbar/navbar.component';
import { ContentComponent } from './components/content.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PackagesComponent } from './components/packages/packages.component';
import { FaqComponent } from './components/faq/faq.component';
import { SettingsComponent } from './components/settings/settings.component';
import { EmailHubComponent } from './components/email-hub/email-hub.component';
import { ChartComponentComponent } from './components/dashboard/chart/chart.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { LoginComponent } from './components/login/login.component';
import { DropdownComponent } from './components/dashboard/dropdown/dropdown.component';

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
    MainLayoutComponent,
    LoginLayoutComponent,
    LoginComponent,
    DropdownComponent,
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
    CheckboxModule,
    ImageModule,
    DropdownModule,
    FormsModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
