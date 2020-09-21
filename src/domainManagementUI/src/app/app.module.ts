import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';

//Angular Modules
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MaterialModule } from './material.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

//Custom Components
import { AppComponent } from './app.component';
import { DomainManagementDetailsComponent } from 'src/app/components/domain-management/domain-managment-details/domain-management-details.component';
import { DomainManagementListComponent } from 'src/app/components/domain-management/domain-management-list/domain-management-list.component';
import { DomainUtilizedListComponent } from 'src/app/components/domain-utilization/domain-utilization-list/domain-utilization-list.component';
import { LayoutMainComponent } from 'src/app/components/layout/layout-main/layout-main.component';
import { WebsiteTemplateDetailsComponent } from 'src/app/components/website-templates/website-templates-details/website-templates-details.component';
import { WebsiteTemplatesListComponent } from 'src/app/components/website-templates/website-templates-list/website-templates-list.component';

//Services
import { DomainManagementService } from 'src/app/services/domain-management.service';
import { DomainUtilizationService } from 'src/app/services/domain-utilization.service';
import { LayoutService } from './services/layout.service';
import { SettingsHttpService } from 'src/app/services/settings-http.service';
import { ThemeService } from './services/theme.service';
import { UserAuthService } from './services/user-auth.service'
import { WebsiteTemplatesService } from 'src/app/services/website-templates.service';

//Helpers
import { AuthAppendInterceptor } from 'src/app/helpers/AuthAppendInterceptor'
import { UnauthorizedInterceptor } from 'src/app/helpers/UnauthorizedInterceptor'

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
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule,
  ],
  providers: [
    DomainManagementService,
    DomainUtilizationService,
    HttpClient,
    LayoutService,
    ThemeService,
    UserAuthService,
    WebsiteTemplatesService,
    {
      provide: APP_INITIALIZER,
      useFactory: app_Init,
      deps: [SettingsHttpService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthAppendInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
