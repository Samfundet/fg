import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  MainComponent,
  InfoComponent,
  KontaktComponent,
  InternComponent,
  HistoryComponent,
  PricepointsComponent,
  FaqComponent,
  CreditComponent,
  PhotosComponent,
  UploadComponent,
  NotFoundComponent
} from 'app/components';

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
    // canActivate: [AuthGuardService], TODO
    component: InternComponent,
    children: [
      {
        path: 'opplasting',
        component: UploadComponent
      }
    ]
  },
  {
    path: 'foto',
    component: PhotosComponent
  },
  {
    path: 'info/historie',
    component: HistoryComponent
  },
  {
    path: 'info/faq',
    component: FaqComponent
  },
  {
    path: 'info/kredittering',
    component: CreditComponent
  },
  {
    path: 'info/priser',
    component: PricepointsComponent
  },
  { // 404 If not recognized
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
