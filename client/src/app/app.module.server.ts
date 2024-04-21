import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { DatePipe } from '@angular/common';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
  providers: [DatePipe]
})
export class AppServerModule {}
