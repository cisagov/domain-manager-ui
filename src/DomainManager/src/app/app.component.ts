import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Domain Manager';

  constructor(private themeSvc: ThemeService) {}

  getTheme() {
    return this.themeSvc.getStoredTheme();
  }
}
