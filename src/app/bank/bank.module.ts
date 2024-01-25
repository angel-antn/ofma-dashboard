import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankRoutingModule } from './bank-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LayoutComponent, ListPageComponent],
  imports: [
    CommonModule,
    BankRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule,
  ],
})
export class BankModule {}
