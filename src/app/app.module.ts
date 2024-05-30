import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';



// Routing
import {CoreModule} from './core/core.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {IndexComponent} from './index/index.component';


import SupabaseService from './shared/supabaseDB';


import {CommonModule} from '@angular/common';
import { ProjectsComponent } from './projects/projects.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    IndexComponent,
    ProjectsComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
