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
import { BannerComponent } from './components/banner/banner.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';
import { MasonryLayoutDirective } from './directives/masonry-layout.directive';
import { InfoComponent } from './components/info/info.component';
import { InternComponent } from './components/intern/intern.component';
import { KontaktComponent } from './components/kontakt/kontakt.component';
import { UploadComponent } from './components/intern/upload/upload.component';
import { HistoryComponent } from './components/history/history.component';
import { CreditComponent } from './components/credit/credit.component';
import { PricepointsComponent } from './components/pricepoints/pricepoints.component';
import { FaqComponent } from './components/faq/faq.component';
import { PersonComponent } from './components/kontakt/person/person.component';
import { PhotosComponent } from './components/photos/photos.component';
import { PhotoMasonryComponent } from './components/photo-masonry/photo-masonry.component';

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
    PhotoMasonryComponent
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
