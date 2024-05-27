import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Routing
import {CoreModule} from './core/core.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {IndexComponent} from './index/index.component';
import {ThankyouComponent} from './thankyou/thankyou.component';

import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    IndexComponent,
    ThankyouComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
