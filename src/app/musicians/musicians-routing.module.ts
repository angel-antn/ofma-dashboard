import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { MusicianPageComponent } from './pages/musician-page/musician-page.component';
import { NotFoundErrorPageComponent } from '../shared/pages/not-found-error-page/not-found-error-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'new-musician', component: NewPageComponent },
      { path: 'list', component: ListPageComponent },
      { path: 'edit/:id', component: NewPageComponent },
      { path: ':id', component: MusicianPageComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', component: NotFoundErrorPageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusiciansRoutingModule {}
