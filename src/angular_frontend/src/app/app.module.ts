import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    GalleryComponent,
    BannerComponent,
    MainComponent,
    FooterComponent,
    MasonryLayoutDirective,
    InfoComponent
  ],
  imports: [
    BrowserModule,
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
