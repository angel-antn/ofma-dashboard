import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { MusicianPageComponent } from './pages/musician-page/musician-page.component';
import { NotFoundErrorPageComponent } from '../shared/pages/not-found-error-page/not-found-error-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'list', component: ListPageComponent },
      { path: ':id', component: MusicianPageComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusiciansRoutingModule {}
