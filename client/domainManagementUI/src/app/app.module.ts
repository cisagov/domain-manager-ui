import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DomainManagementDetailsComponent } from 'src/app/components/domain-management/domain-managment-details/domain-management-details.component';
import { DomainManagementListComponent } from 'src/app/components/domain-management/domain-management-list/domain-management-list.component';
import { DomainUtilizedListComponent } from 'src/app/components/domain-utilization/domain-utilization-list/domain-utilization-list.component';

import { LayoutMainComponent } from 'src/app/components/layout/layout-main/layout-main.component';
import { WebsiteTemplateDetailsComponent } from 'src/app/components/webstie-templates/website-templates-details/website-templates-details.component';
import { WebsiteTemplatesListComponent } from 'src/app/components/webstie-templates/website-templates-list/website-templates-list.component';

import { DomainManagementService } from 'src/app/services/domain-management.service';
import { DomainUtilizationService } from 'src/app/services/domain-utilization.service';
import { LayoutService } from './services/layout.service';
import { SettingsHttpService } from 'src/app/services/settings-http.service';
import { ThemeService } from './services/theme.service';
import { WebsiteTemplatesService } from 'src/app/services/website-templates.service';

export function app_Init(settingsHttpService: SettingsHttpService) {
  return () => settingsHttpService.initializeApp();
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutMainComponent,
    DomainManagementDetailsComponent,
    DomainManagementListComponent,
    DomainUtilizedListComponent,
    WebsiteTemplateDetailsComponent,
    WebsiteTemplatesListComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    MatSortModule,
    MatTableModule,
  ],
  providers: [
    DomainManagementService,
    DomainUtilizationService,
    HttpClient,
    LayoutService,
    ThemeService,
    WebsiteTemplatesService,
    {
      provide: APP_INITIALIZER,
      useFactory: app_Init,
      deps: [SettingsHttpService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
