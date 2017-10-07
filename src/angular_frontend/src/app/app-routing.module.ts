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
  NotFoundComponent,
  SearchComponent,
  EditComponent,
  ShoppingCartComponent,
} from 'app/components';

import { AuthGuardService } from 'app/services';

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
    canActivate: [AuthGuardService],
    component: InternComponent,
    children: [
      {
        path: 'opplasting',
        component: UploadComponent
      },
      {
        path: 'søk',
        component: SearchComponent
      },
      {
        path: 'rediger',
        component: EditComponent
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
  {
    path: 'handlekurv',
    component: ShoppingCartComponent
  },
  { // 404 If not recognized
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
