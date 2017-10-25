import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ngfModule } from 'angular-file';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgProgressModule, NgProgressInterceptor } from 'ngx-progressbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ApiService } from './services/api.service';
import { StoreService } from './services/store.service';
import { AuthGuardService } from './services/auth-guard.service';
import { OutAuthInterceptor } from './services/interceptor.service';
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
  NotFoundComponent,
  SearchComponent,
  EditComponent,
  LoginComponent,
  ShoppingCartComponent,
  ApplyFgComponent,
  BookFgComponent,
  ArchiveAdminComponent,
  AlbumComponent,
  CategoryComponent,
  MediaComponent,
  PlaceComponent,
  StatisticsComponent
} from 'app/components';

import { ChipsComponent } from 'app/utils/chips/chips.component';
import { ChipComponent } from 'app/utils/chips/chip/chip.component';

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
    NotFoundComponent,
    SearchComponent,
    EditComponent,
    LoginComponent,
    ShoppingCartComponent,
    ChipsComponent,
    ChipComponent,
    ApplyFgComponent,
    BookFgComponent,
    ArchiveAdminComponent,
    AlbumComponent,
    CategoryComponent,
    MediaComponent,
    PlaceComponent,
    StatisticsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ngfModule,
    FlexLayoutModule,
    NgxMyDatePickerModule.forRoot(),
    ClickOutsideModule,
    NgProgressModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'nb-NO'
    },
    { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: OutAuthInterceptor,
    //   multi: true
    // },
    ApiService,
    StoreService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
