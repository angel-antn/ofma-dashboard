import { Component } from '@angular/core';
import { SidebarStateService } from '../../services/sidebar-state.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth-service.service';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styles: [],
})
export class AdminSidebarComponent {
  constructor(
    private sidebarStateService: SidebarStateService,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  get isDarkMode() {
    return this.themeService.isDarkMode;
  }

  onButtonClick(route: string) {
    console.log(route);
    this.sidebarVisible = false;
    this.router.navigate([route]);
  }
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
  get sidebarVisible(): boolean {
    return this.sidebarStateService.sidebarVisible;
  }
  set sidebarVisible(isVisible: boolean) {
    this.sidebarStateService.sidebarVisible = isVisible;
  }
}
