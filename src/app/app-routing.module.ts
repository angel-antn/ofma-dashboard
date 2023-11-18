import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundErrorPageComponent } from './shared/pages/not-found-error-page/not-found-error-page.component';
import { authActivateGuard, authMatchGuard } from './auth/guards/auth.guard';
import {
  publicActivateGuard,
  publicMatchGuard,
} from './auth/guards/public.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [publicActivateGuard],
    canMatch: [publicMatchGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [authActivateGuard],
    canMatch: [authMatchGuard],
  },
  { path: '404', component: NotFoundErrorPageComponent },
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
