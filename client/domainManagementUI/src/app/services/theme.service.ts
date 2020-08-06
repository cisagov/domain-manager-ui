import { Injectable, EventEmitter } from '@angular/core';

export interface SiteTheme {
  name: string;
  active: boolean;
}

@Injectable()
export class ThemeService {
  static storageKey = 'siteTheme';
  static themeIsDark: boolean;

  onThemeUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();

  storeTheme(isDark: boolean) {
    try {
      localStorage.setItem(ThemeService.storageKey, isDark.toString());
      ThemeService.themeIsDark = isDark;
    } catch {}

    this.onThemeUpdate.emit(ThemeService.themeIsDark);
  }

  getStoredTheme(): boolean | null {
    try {
      return localStorage.getItem(ThemeService.storageKey) == 'true'
        ? true
        : false;
    } catch {
      return null;
    }
  }

  clearStorage() {
    try {
      localStorage.removeItem(ThemeService.storageKey);
    } catch {}
  }
}
