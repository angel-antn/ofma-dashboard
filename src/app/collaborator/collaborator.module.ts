import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollaboratorRoutingModule } from './collaborator-routing.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [ListPageComponent, LayoutComponent],
  imports: [
    CommonModule,
    CollaboratorRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule,
  ],
})
export class CollaboratorModule {}
