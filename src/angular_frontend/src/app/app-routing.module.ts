import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent, InfoComponent } from 'app/components';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/forside',
    pathMatch: 'full'
  },
  {
    path: 'forside',
    component: MainComponent
  },
  {
    path: 'info',
    component: InfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
