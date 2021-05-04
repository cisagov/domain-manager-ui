import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HelpService } from 'src/app/services/help.service';
import { ThemeService } from 'src/app/services/theme.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { LoginService } from 'src/app/services/login.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-main',
  templateUrl: './layout-main.component.html',
  styleUrls: ['./layout-main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutMainComponent implements OnInit {
  isDark = false;
  currentUserName = '';

  constructor(
    private helpSvc: HelpService,
    private themeSvc: ThemeService,
    public layoutSvc: LayoutService,
    public loginSvc: LoginService,
    public userAuthSvc: UserAuthService,
    public overlayContainer: OverlayContainer,
    public location: Location,
    private router: Router
  ) {
    this.isDark = themeSvc.getStoredTheme();
    if (this.isDark) {
      overlayContainer.getContainerElement().classList.add('theme-alternate');
    }
    if (this.loginSvc.isLoggedIn()) {
      this.currentUserName = localStorage.getItem('username');
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

  myProfile() {
    this.router.navigate([`/user/details/${this.currentUserName}/`]);
  }

  help() {
    console.log('HELP');
    this.helpSvc.getUserGuide().subscribe(
      (success) => {
        console.log(success);
        this.downloadObject('DomainManagerUserGuide.pdf', success);
      },
      (failure) => {
        console.log(failure);
      }
    );
  }
  featureRequest() {
    window.open(
      'https://github.com/cisagov/domain-manager-ui/issues/new?assignees=&labels=&template=issue.md',
      '_blank'
    );
  }
  bugReport() {
    window.open(
      'https://github.com/cisagov/domain-manager-ui/issues/new?assignees=&labels=&template=bug.md',
      '_blank'
    );
  }

  downloadObject(filename, blob) {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  logOut() {
    this.loginSvc.logout();
  }

  ngOnInit(): void {}
}
