import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LayoutComponent, LoginPageComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    PrimeNgModule,
    RouterModule,
    ReactiveFormsModule,
  ],
})
export class AuthModule {}
