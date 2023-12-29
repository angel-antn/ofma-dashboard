import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { ContentPageComponent } from './pages/content-page/content-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { LayoutComponent } from './layout/layout.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ContentPageComponent, ListPageComponent, LayoutComponent],
  imports: [
    CommonModule,
    ContentRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule,
  ],
})
export class ContentModule {}
