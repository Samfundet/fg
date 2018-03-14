import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, LOCALE_ID} from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {ngfModule} from 'angular-file';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxMyDatePickerModule} from 'ngx-mydatepicker';
import {ClickOutsideModule} from 'ng-click-outside';
import {NgProgressModule} from '@ngx-progressbar/core';
import {NgProgressHttpClientModule} from '@ngx-progressbar/http-client';
import {registerLocaleData} from '@angular/common';
import {MatTooltipModule, MatAutocompleteModule} from '@angular/material';
import {ToastrModule} from 'ngx-toastr';
import localeNb from '@angular/common/locales/nb';

registerLocaleData(localeNb);

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {ApiService} from './services/api.service';
import {StoreService} from './services/store.service';
import {AuthGuardService} from './services/auth-guard.service';
import {OutAuthInterceptor} from './services/interceptor.service';
import {MegabytePipe} from 'app/pipes/pipes.pipe';
import {MasonryLayoutDirective, ImagePreviewDirective} from 'app/directives';
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
  PhotogangbangerComponent,
  PhotogangbangerModalComponent,
  PowerusersComponent,
  PowerusersModalComponent,
  ApplyFgComponent,
  BookFgComponent,
  ArchiveAdminComponent,
  AlbumComponent,
  ForeignKeyModalComponent,
  CategoryComponent,
  MediaComponent,
  PlaceComponent,
  StatisticsComponent,
  OrdersComponent,
  NewOrdersComponent,
  OldOrdersComponent,
  AnalogUploadComponent,
  RegisterFilmComponent,
  UploadScannedComponent,
  MetadataModalComponent
} from 'app/components';

import {
  ChipsComponent,
  ChipComponent,
  RadioButtonsComponent,
  BarchartComponent,
  PaginatorComponent
} from 'app/utils';

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
    PhotogangbangerComponent,
    PhotogangbangerModalComponent,
    PowerusersComponent,
    PowerusersModalComponent,
    ApplyFgComponent,
    BookFgComponent,
    ArchiveAdminComponent,
    AlbumComponent,
    ForeignKeyModalComponent,
    CategoryComponent,
    MediaComponent,
    PlaceComponent,
    StatisticsComponent,
    OrdersComponent,
    NewOrdersComponent,
    OldOrdersComponent,
    RadioButtonsComponent,
    BarchartComponent,
    AnalogUploadComponent,
    RegisterFilmComponent,
    UploadScannedComponent,
    MetadataModalComponent,
    PaginatorComponent
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
    ClickOutsideModule,
    MatTooltipModule,
    MatAutocompleteModule,
    ToastrModule.forRoot({
      progressBar: true,
      positionClass: 'toast-top-center' // Put this in center so it isn't in the way of anything
    }),
    NgxMyDatePickerModule.forRoot(),
    NgProgressModule.forRoot(),
    NgProgressHttpClientModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'nb-NO'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OutAuthInterceptor,
      multi: true
    },
    ApiService,
    StoreService,
    AuthGuardService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
