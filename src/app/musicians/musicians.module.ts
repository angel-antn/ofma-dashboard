import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MusiciansRoutingModule } from './musicians-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { MusicianPageComponent } from './pages/musician-page/musician-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { SharedModule } from '../shared/shared.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

@NgModule({
  declarations: [
    LayoutComponent,
    MusicianPageComponent,
    ListPageComponent,
    NewPageComponent,
  ],
  imports: [CommonModule, MusiciansRoutingModule, SharedModule, PrimeNgModule],
})
export class MusiciansModule {}
