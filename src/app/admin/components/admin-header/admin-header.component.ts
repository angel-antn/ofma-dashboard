import { Component } from '@angular/core';
import { SidebarStateService } from '../../services/sidebar-state.service';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styles: [],
})
export class AdminHeaderComponent {
  constructor(
    private sidebarStateService: SidebarStateService,
    private themeService: ThemeService
  ) {}
  get isDarkMode() {
    return this.themeService.isDarkMode;
  }
  get sidebarVisible(): boolean {
    return this.sidebarStateService.sidebarVisible;
  }
  set sidebarVisible(isVisible: boolean) {
    this.sidebarStateService.sidebarVisible = isVisible;
  }
}
