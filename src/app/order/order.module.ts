import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [ListPageComponent, LayoutComponent],
  imports: [CommonModule, OrderRoutingModule],
})
export class OrderModule {}
