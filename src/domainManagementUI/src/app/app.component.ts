import { Component } from '@angular/core';
import { ThemeService } from '../app/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'domainManagementUI';

  constructor(private themeSvc: ThemeService) {}

  getTheme() {
    return this.themeSvc.getStoredTheme();
  }
}
