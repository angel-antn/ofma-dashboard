import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConcertsRoutingModule } from './concerts-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ConcertPageComponent } from './pages/concert-page/concert-page.component';

@NgModule({
  declarations: [LayoutComponent, ListPageComponent, ConcertPageComponent],
  imports: [CommonModule, ConcertsRoutingModule],
})
export class ConcertsModule {}
