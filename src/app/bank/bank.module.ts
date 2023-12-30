import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankRoutingModule } from './bank-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { ListPageComponent } from './pages/list-page/list-page.component';

@NgModule({
  declarations: [LayoutComponent, ListPageComponent],
  imports: [CommonModule, BankRoutingModule],
})
export class BankModule {}
