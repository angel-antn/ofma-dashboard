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
  {
    path: 'collaborator',
    component: LayoutComponent,
    loadChildren: () =>
      import('../collaborator/collaborator.module').then(
        (m) => m.CollaboratorModule
      ),
  },
  {
    path: 'order',
    component: LayoutComponent,
    loadChildren: () =>
      import('../order/order.module').then((m) => m.OrderModule),
  },
  {
    path: 'bank',
    component: LayoutComponent,
    loadChildren: () => import('../bank/bank.module').then((m) => m.BankModule),
  },
  { path: '', redirectTo: 'concerts', pathMatch: 'full' },
  { path: '**', redirectTo: 'concerts' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
