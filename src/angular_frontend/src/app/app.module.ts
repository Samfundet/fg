import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ngfModule } from 'angular-file';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ApiService } from './services/api.service';
import { StoreService } from './services/store.service';
import { MegabytePipe } from 'app/pipes/pipes.pipe';
import { MasonryLayoutDirective, ImagePreviewDirective } from 'app/directives';
import {
  NavComponent,
  GalleryComponent,
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
    // Pipes
    MegabytePipe,
    // Directives
    MasonryLayoutDirective,
    ImagePreviewDirective,
    // Components
    AppComponent,
    NavComponent,
    GalleryComponent,
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
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ngfModule,
    FlexLayoutModule
  ],
  providers: [
    ApiService,
    StoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
