import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent, InfoComponent, KontaktComponent, InternComponent } from 'app/components';

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
  },
  {
    path: 'kontakt',
    component: KontaktComponent
  },
  {
    path: 'intern',
    component: InternComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
