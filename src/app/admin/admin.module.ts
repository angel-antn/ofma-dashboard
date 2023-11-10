import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';

@NgModule({
  declarations: [LayoutComponent, AdminSidebarComponent, AdminHeaderComponent],
  imports: [CommonModule, AdminRoutingModule, PrimeNgModule],
})
export class AdminModule {}
