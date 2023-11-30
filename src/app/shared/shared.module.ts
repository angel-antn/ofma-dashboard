import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundErrorPageComponent } from './pages/not-found-error-page/not-found-error-page.component';
import { SwitchThemeComponent } from './components/switch-theme/switch-theme.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [NotFoundErrorPageComponent, SwitchThemeComponent],
  imports: [CommonModule, PrimeNgModule, FormsModule],
  exports: [NotFoundErrorPageComponent, SwitchThemeComponent],
})
export class SharedModule {}
