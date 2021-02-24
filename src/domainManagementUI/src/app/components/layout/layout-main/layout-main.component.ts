import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeService } from 'src/app/services/theme.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { LoginService } from 'src/app/services/login.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-layout-main',
  templateUrl: './layout-main.component.html',
  styleUrls: ['./layout-main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutMainComponent implements OnInit {
  isDark: boolean = false;
  currentUserName: string = '';

  constructor(
    private themeSvc: ThemeService,
    public layoutSvc: LayoutService,
    public loginSvc: LoginService,
    public userAuthSvc: UserAuthService,
    public overlayContainer: OverlayContainer,
    public location: Location
  ) {
    this.isDark = themeSvc.getStoredTheme();
    if (this.isDark) {
      overlayContainer.getContainerElement().classList.add('theme-alternate');
    }
    // this.userAuthSvc.getUserNameBehaviorSubject().subscribe((value) => {
    //   this.currentUserName = value;
    // });
    if (this.loginSvc.isLoggedIn()) {
      this.currentUserName = sessionStorage.getItem('username');
    }
  }

  @ViewChild('drawer', { static: false })
  drawer: MatSidenav;
  @ViewChild('mainContent', { static: false })
  mainContent;

  setTheme(event) {
    this.themeSvc.storeTheme(event.checked);
    this.isDark = event.checked;
    if (event.checked) {
      this.overlayContainer
        .getContainerElement()
        .classList.add('theme-alternate');
    } else {
      this.overlayContainer
        .getContainerElement()
        .classList.remove('theme-alternate');
    }
  }

  help() {
    const angularRoute = this.location.path();
    const url = window.location.href;
    const appDomain = url.replace(angularRoute, '');

    let helpUrl = appDomain + '/assets/htmlhelp/introduction_to_con_pca.htm';
    window.open(helpUrl, '_blank');
  }

  logOut() {
    this.loginSvc.logout();
  }

  ngOnInit(): void {}
}
