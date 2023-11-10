import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarStateService {
  sidebarVisible = false;

  constructor() {}
}
