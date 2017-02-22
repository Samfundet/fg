import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternRoutingModule } from './intern-routing.module';
import { InternComponent } from './intern.component';

@NgModule({
  imports: [
    CommonModule,
    InternRoutingModule
  ],
  declarations: [InternComponent]
})
export class InternModule { }
