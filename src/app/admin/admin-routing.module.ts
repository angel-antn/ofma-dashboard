import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: 'concerts',
    component: LayoutComponent,
    loadChildren: () =>
      import('../concerts/concerts.module').then((m) => m.ConcertsModule),
  },
  {
    path: 'content',
    component: LayoutComponent,
    loadChildren: () =>
      import('../content/content.module').then((m) => m.ContentModule),
  },
  {
    path: 'musicians',
    component: LayoutComponent,
    loadChildren: () =>
      import('../musicians/musicians.module').then((m) => m.MusiciansModule),
  },
  { path: '', redirectTo: 'concerts', pathMatch: 'full' },
  { path: '**', redirectTo: 'concerts' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
