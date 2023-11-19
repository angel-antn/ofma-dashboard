import { Component } from '@angular/core';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './layout.component.html',
  styles: [],
})
export class LayoutComponent {
  constructor(private themeService: ThemeService) {
    this.isDarkMode = themeService.isDarkMode;
  }
  isDarkMode = true;
  switchTheme() {
    this.themeService.switchTheme();
  }
}
