import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'shared-switch-theme',
  templateUrl: './switch-theme.component.html',
  styleUrls: [],
})
export class SwitchThemeComponent {
  constructor(private themeService: ThemeService) {
    this.isDarkMode = themeService.isDarkMode;
  }
  isDarkMode = true;
  switchTheme() {
    this.themeService.switchTheme();
  }
}
