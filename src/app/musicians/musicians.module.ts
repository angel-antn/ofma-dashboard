import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MusiciansRoutingModule } from './musicians-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { MusicianPageComponent } from './pages/musician-page/musician-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { SharedModule } from '../shared/shared.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LayoutComponent, MusicianPageComponent, ListPageComponent],
  imports: [
    CommonModule,
    MusiciansRoutingModule,
    SharedModule,
    PrimeNgModule,
    ReactiveFormsModule,
  ],
})
export class MusiciansModule {}
