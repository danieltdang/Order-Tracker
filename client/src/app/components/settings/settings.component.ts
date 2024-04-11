import { Component } from '@angular/core';
import { Theme } from "./theme";
import { ThemeService } from '../../theme-service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  themes: Theme[] | undefined;
  selectedTheme: Theme | undefined;

  currPass: string | undefined;
  confirmPass1: string | undefined;
  confirmPass2: string | undefined;

  constructor(private themeService: ThemeService) { }

  changeTheme() {
    if (this.selectedTheme) {
      this.themeService.switchTheme(this.selectedTheme.name);
    }
  }

  ngOnInit() {
    this.themes = [
      { name: 'lara-dark-blue', displayName: 'Dark Theme' },
      { name: 'lara-light-blue', displayName: 'Light Theme' },
    ];

    this.selectedTheme = this.themes[0];
  }
}
