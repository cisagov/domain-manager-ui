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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

//Custom Components
import { AboutComponent } from 'src/app/components/about/about.component';
import { AppComponent } from './app.component';
import { ApplicationsComponent } from 'src/app/components/applications/applications.component';
import { DomainManagementCustomAttributesTab } from 'src/app/components/domain-management/domain-managment-details/tabs/custom-attributes/domain-management-custom-attributes.component';
import { DomainManagementGeneralAttributesTab }  from 'src/app/components/domain-management/domain-managment-details/tabs/general-attributes/domain-management-general-attributes.component';
import { DomainManagementProxyCategorizaitonTab }  from 'src/app/components/domain-management/domain-managment-details/tabs/proxy-categorization/domain-management-proxy-categorization.component';
import { DomainManagementReviewTab }  from 'src/app/components/domain-management/domain-managment-details/tabs/review/domain-management-review.component';
import { DomainManagementTemplateSelectionTab }  from 'src/app/components/domain-management/domain-managment-details/tabs/template-selection/domain-management-template-selection.component';
import { DomainManagementDetailsComponent } from 'src/app/components/domain-management/domain-managment-details/domain-management-details.component';
import { DomainManagementListComponent } from 'src/app/components/domain-management/domain-management-list/domain-management-list.component';
import { LayoutMainComponent } from 'src/app/components/layout/layout-main/layout-main.component';
import { WebsiteDetailsComponent } from 'src/app/components/website/website-details/website-details.component';
import { WebsiteListComponent } from 'src/app/components/website/website-list/website-list.component';

//Services
import { DomainManagementService } from 'src/app/services/domain-management.service';
import { LayoutService } from './services/layout.service';
import { SettingsHttpService } from 'src/app/services/settings-http.service';
import { ThemeService } from './services/theme.service';
import { UserAuthService } from './services/user-auth.service'
import { WebsiteService } from 'src/app/services/website.service';

//Helpers
import { AuthAppendInterceptor } from 'src/app/helpers/AuthAppendInterceptor';
import { UnauthorizedInterceptor } from 'src/app/helpers/UnauthorizedInterceptor';

export function app_Init(settingsHttpService: SettingsHttpService) {
  return () => settingsHttpService.initializeApp();
}

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    ApplicationsComponent,
    LayoutMainComponent,
    DomainManagementDetailsComponent,
    DomainManagementListComponent,
    DomainManagementCustomAttributesTab,
    DomainManagementGeneralAttributesTab,
    DomainManagementProxyCategorizaitonTab,
    DomainManagementReviewTab,
    DomainManagementTemplateSelectionTab,
    WebsiteDetailsComponent,
    WebsiteListComponent,
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
    HttpClient,
    LayoutService,
    ThemeService,
    UserAuthService,
    WebsiteService,
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
