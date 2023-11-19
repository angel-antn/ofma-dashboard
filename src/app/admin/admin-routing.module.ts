import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: 'musicians',
    component: LayoutComponent,
    loadChildren: () =>
      import('../musicians/musicians.module').then((m) => m.MusiciansModule),
  },
  {
    path: 'content',
    component: LayoutComponent,
    loadChildren: () =>
      import('../content/content.module').then((m) => m.ContentModule),
  },
  { path: '', redirectTo: 'musicians', pathMatch: 'full' },
  { path: '**', redirectTo: 'musicians' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
