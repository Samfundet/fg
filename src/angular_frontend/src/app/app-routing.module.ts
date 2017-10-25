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
  PhotogangbangerComponent,
  PowerusersComponent,
  ApplyFgComponent,
  BookFgComponent,
  ArchiveAdminComponent,
  AlbumComponent,
  CategoryComponent,
  MediaComponent,
  PlaceComponent,
  StatisticsComponent
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
      },
      {
        path: 'fotogjengere',
        component: PhotogangbangerComponent
      },
      {
        path: 'powerbrukere',
        component: PowerusersComponent
      },
      {
        path: 'arkivadmin',
        component: ArchiveAdminComponent,
        children: [
          {
            path: 'album',
            component: AlbumComponent
          },
          {
            path: 'kategori',
            component: CategoryComponent
          },
          {
            path: 'medium',
            component: MediaComponent
          },
          {
            path: 'place',
            component: PlaceComponent
          },
          {
            path: 'statistikk',
            component: StatisticsComponent
          },
        ]
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
    path: 'info/soke-fotogjengen',
    component: ApplyFgComponent
  },
  {
    path: 'info/leie-fotogjengen',
    component: BookFgComponent
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
