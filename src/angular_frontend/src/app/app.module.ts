import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components, only available from barrel if exported in ./app/components/index.ts
import { NavComponent } from './components/nav/nav.component';
import { GalleryComponent } from './components/gallery/gallery.component';
// Services
import { ApiService } from './services/api.service';
import { StoreService } from './services/store.service';
import { MasonryLayoutDirective } from './directives/masonry-layout.directive';
import {
  BannerComponent,
  MainComponent,
  FooterComponent,
  InfoComponent,
  InternComponent,
  KontaktComponent,
  UploadComponent,
  HistoryComponent,
  CreditComponent,
  PricepointsComponent,
  FaqComponent,
  PersonComponent,
  PhotosComponent,
  PhotoMasonryComponent,
  PhotoModalComponent,
  NotFoundComponent
} from 'app/components';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    GalleryComponent,
    BannerComponent,
    MainComponent,
    FooterComponent,
    MasonryLayoutDirective,
    InfoComponent,
    InternComponent,
    KontaktComponent,
    UploadComponent,
    HistoryComponent,
    CreditComponent,
    PricepointsComponent,
    FaqComponent,
    PersonComponent,
    PhotosComponent,
    PhotoMasonryComponent,
    PhotoModalComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    ApiService,
    StoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
