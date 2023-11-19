import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDarkMode = true;
  theme: 'soho-dark' | 'soho-light' = 'soho-dark';
  constructor(@Inject(DOCUMENT) private document: Document) {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme || !['soho-light', 'soho-dark'].includes(savedTheme)) {
      localStorage.setItem('theme', 'soho-dark');
    }
    if (savedTheme === 'soho-light') {
      this.isDarkMode = false;
      this.theme = 'soho-light';

      let themeLink = this.document.getElementById(
        'app-theme'
      ) as HTMLLinkElement;

      if (!themeLink) return;

      themeLink.href = this.theme + '.css';
    }
  }

  switchTheme() {
    let themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;

    if (!themeLink) return;

    if (this.theme === 'soho-light') {
      this.theme = 'soho-dark';
      this.isDarkMode = true;
    } else {
      this.theme = 'soho-light';
      this.isDarkMode = false;
    }

    themeLink.href = this.theme + '.css';

    localStorage.setItem('theme', this.theme);
  }
}
