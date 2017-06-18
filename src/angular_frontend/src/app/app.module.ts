import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components, only available from barrel if exported in ./app/components/index.ts
import { NavComponent } from './components/nav/nav.component';
import { GalleryComponent } from './components/gallery/gallery.component';
// Services
import { ApiService } from './services/api.service';
import { StoreService } from './services/store.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    GalleryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    ApiService,
    StoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
