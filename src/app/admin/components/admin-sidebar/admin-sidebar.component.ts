import { Component } from '@angular/core';
import { SidebarStateService } from '../../services/sidebar-state.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styles: [],
})
export class AdminSidebarComponent {
  constructor(private sidebarStateService: SidebarStateService) {}
  get sidebarVisible(): boolean {
    return this.sidebarStateService.sidebarVisible;
  }
  set sidebarVisible(isVisible: boolean) {
    this.sidebarStateService.sidebarVisible = isVisible;
  }
}
