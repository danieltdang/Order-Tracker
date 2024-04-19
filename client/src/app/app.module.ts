import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
import { PasswordModule } from 'primeng/password';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { GoogleMapsModule } from '@angular/google-maps';

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
import { ChartComponent } from './components/dashboard/chart/chart.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { LoginComponent } from './components/login/login.component';
import { DropdownComponent } from './components/dashboard/dropdown/dropdown.component';
import { SignupComponent } from './components/login/signup.component';
import { ForgotComponent } from './components/login/forgot.component';
import { PackageDetailComponent } from './components/packages/package-detail/package-detail.component';
import { NotFoundComponent } from './layout/not-found/not-found.component';
import { EmailViewerComponent } from './components/email-hub/email-viewer/email-viewer.component';

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
    ChartComponent,
    MainLayoutComponent,
    LoginLayoutComponent,
    LoginComponent,
    DropdownComponent,
    SignupComponent,
    ForgotComponent,
    PackageDetailComponent,
    NotFoundComponent,
    EmailViewerComponent,
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
    PasswordModule,
    ConfirmDialogModule,
    ToastModule,
    TableModule,
    GoogleMapsModule,
    ToolbarModule,
    DialogModule,
    AccordionModule,
    SkeletonModule,
    TagModule,
    InputTextareaModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
