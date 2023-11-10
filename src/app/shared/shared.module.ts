import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundErrorPageComponent } from './pages/not-found-error-page/not-found-error-page.component';

@NgModule({
  declarations: [NotFoundErrorPageComponent],
  imports: [CommonModule],
  exports: [NotFoundErrorPageComponent],
})
export class SharedModule {}
