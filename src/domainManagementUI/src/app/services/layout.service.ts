import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable()
export class LayoutService {
  static title: string;
  static content_height: number;
  static side_nav: MatSidenav;

  onTitleUpdate: EventEmitter<string> = new EventEmitter<string>();
  navBarSet: EventEmitter<boolean> = new EventEmitter<boolean>();

  setTitle(title: string) {
    try {
      LayoutService.title = title;
    } catch {}

    this.onTitleUpdate.emit(LayoutService.title);
  }

  getTitle() {
    return LayoutService.title;
  }

  setSideNav(side_nav_arg) {
    try {
      LayoutService.side_nav = side_nav_arg;
    } catch {}
    this.navBarSet.emit(true);
  }
  getSideNavIsSet() {
    return this.navBarSet;
  }

  closeSideNav() {
    return LayoutService.side_nav.close();
  }

  openSideNav() {
    return LayoutService.side_nav.open();
  }

  toggleSideNav() {
    return LayoutService.side_nav.toggle();
  }
}
