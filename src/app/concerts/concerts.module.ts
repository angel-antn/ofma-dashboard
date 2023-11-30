import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConcertsRoutingModule } from './concerts-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ConcertPageComponent } from './pages/concert-page/concert-page.component';
import { LayoutComponent } from './layout/layout.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListPageComponent, ConcertPageComponent, LayoutComponent],
  imports: [
    CommonModule,
    ConcertsRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule,
  ],
})
export class ConcertsModule {}
