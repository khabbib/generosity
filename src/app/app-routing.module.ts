import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { IndexComponent } from './index/index.component';


const routes: Routes = [
  {path: 'index', component: IndexComponent},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'thankyou', component: ThankyouComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
