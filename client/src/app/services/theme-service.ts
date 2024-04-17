import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Theme } from '../interfaces/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themes = [
    { name: 'lara-dark-blue', displayName: 'Dark Theme' },
    { name: 'lara-light-blue', displayName: 'Light Theme' },
  ];
  private selectedTheme: Theme = this.themes[0];

  constructor(@Inject(DOCUMENT) private document: Document) {}

  switchTheme(theme: string) {
    let themeLink = this.document.getElementById('theme-link') as HTMLLinkElement;

    if (themeLink) {
        themeLink.href = theme + '.css';
    }
  }

  getTheme() {
    return this.selectedTheme;
  }

  setTheme(theme: Theme) {
    this.selectedTheme = theme;
  }

  getThemes() {
    return this.themes;
  }
}
