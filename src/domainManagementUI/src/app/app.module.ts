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

//3rd Party Modules
import { ngfModule, ngf } from 'angular-file';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

//Custom Components
import { AppComponent } from './app.component';
import { ApplicationsDetailsComponent } from './components/applications/applications-details/applications-details.component';
import { ApplicationListComponent } from 'src/app/components/applications/applications-list/application-list.component';
import { ApplicationEditDialogComponent } from './components/applications/application-edit-dialog/application-edit-dialog.component';
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import { DomainDetailsComponent } from 'src/app/components/domain/domain-details/domain-details.component';
import { DomainDetailsAttrbutesComponent } from 'src/app/components/domain/domain-details/tabs/attributes/domain-details-attributes.component';
import { DomainDetailsDemoComponent } from 'src/app/components/domain/domain-details/tabs/demo/domain-details-demo.component';
import { DomainDetailsHistoricalComponent } from 'src/app/components/domain/domain-details/tabs/historical/domain-details-historical.component';
import { DomainDetailsHostedZoneComponent } from 'src/app/components/domain/domain-details/tabs/hosted-zone/domain-details-hosted-zone.component';
import { DomainDetailsProxyCategorizaitonComponent } from 'src/app/components/domain/domain-details/tabs/proxy-categorization/domain-details-proxy-categorization.component';
import { DomainDetailsSummaryComponent } from 'src/app/components/domain/domain-details/tabs/summary/domain-details-summary.component';
import { DomainDetailsTemplateSelectionComponent } from 'src/app/components/domain/domain-details/tabs/template-selection/domain-details-template-selection.component';
import { DomainListComponent } from 'src/app/components/domain/domain-list/domain-list.component';
import { DominDetailsDnsRecordsComponent } from './components/domain/domain-details/tabs/dns-records/domain-details-dns-records.component';
import { DnsRecordsDialogComponent } from './components/domain/domain-details/tabs/dns-records/dns-records-dialog/dns-records-dialog.component';
import { DomainCreateDialogComponent } from 'src/app/components/domain/domain-create-dialog/domain-create-dialog.component';
import { FileUploadDialogComponent } from 'src/app/components/dialog-windows/file-upload/file-upload-dialog.component';
import { LayoutBlankComponent } from 'src/app/components/layout/layout-blank/layout-blank.component';
import { LayoutMainComponent } from 'src/app/components/layout/layout-main/layout-main.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { ProgressBarDialog } from 'src/app/components/dialog-windows/progress-bar/progress-bar-dialog.component';
import { RegisterUserComponent } from 'src/app/components/register/register-user.component';
import { TemplateDetailsComponent } from 'src/app/components/template/template-details/template-details.component';
import { TemplateDetailsConnectedDomainsComponent } from 'src/app/components/template/template-details/tabs/connected-domains/template-details-connected-domains.component';
import { TemplateDetailsDemoComponent } from 'src/app/components/template/template-details/tabs/demo/template-details-demo.component';
import { TemplateListComponent } from 'src/app/components/template/template-list/template-list.component';
import { UserManagementListComponent } from './components/user-managment/user-management-list/user-management-list.component';
import { UserManagementDetailsComponent } from './components/user-managment/user-management-details/user-management-details.component';
import { UserManagementDetailsGroupsComponent } from './components/user-managment/user-management-details/tabs/groups/user-management-details-groups.component';
import { UserManagementDetailsHistoryComponent } from './components/user-managment/user-management-details/tabs/history/user-managment-details-history.component';
import { UserManagementDetailsSummaryComponent } from './components/user-managment/user-management-details/tabs/summary/user-management-details-summary.component';

//Services
import { AlertsService } from 'src/app/services/alerts.service';
import { ApplicationService } from 'src/app/services/applications.service';
import { ApplicationsTabService } from 'src/app/services/tab-services/applications-details-tab.service';
import { CategoryService } from 'src/app/services/category.service';
import { HelpService } from 'src/app/services/help.service';
import { LayoutService } from './services/layout.service';
import { LoginService } from 'src/app/services/login.service';
import { SettingsHttpService } from 'src/app/services/settings-http.service';
import { TemplateService } from 'src/app/services/template.service';
import { ThemeService } from './services/theme.service';
import { TemplateDetailsTabService } from 'src/app/services/tab-services/template-details-tabs.service';
import { UserAuthService } from './services/user-auth.service';
import { UserManagementService } from 'src/app/services/user-management.service';
import { UserManagementTabService } from 'src/app/services/tab-services/user-management-tabs.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';
import { DomainService } from 'src/app/services/domain.service';

//Helpers
import { AuthAppendInterceptor } from 'src/app/helpers/AuthAppendInterceptor';
import { UnauthorizedInterceptor } from 'src/app/helpers/UnauthorizedInterceptor';
import { GenericViewComponent } from './components/dialog-windows/generic-view/generic-view.component';
import { VideoTutorialsComponent } from './components/help/video-tutorials/video-tutorials.component';
import { HelpMenuComponent } from './components/help/help-menu/help-menu.component';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { ApplicationsDetailsSummaryComponent } from './components/applications/applications-details/tabs/applications-details-summary/applications-details-summary.component';
import { ApplicationsDetailsDomainsComponent } from './components/applications/applications-details/tabs/applications-details-domains/applications-details-domains.component';
import { ApplicationsDetailsUsersComponent } from './components/applications/applications-details/tabs/applications-details-users/applications-details-users.component';

export function app_Init(settingsHttpService: SettingsHttpService) {
  return () => settingsHttpService.initializeApp();
}

@NgModule({
  declarations: [
    AppComponent,
    ApplicationsDetailsComponent,
    ApplicationEditDialogComponent,
    ApplicationListComponent,
    ConfirmDialogComponent,
    DnsRecordsDialogComponent,
    DomainCreateDialogComponent,
    DomainDetailsComponent,
    DomainDetailsAttrbutesComponent,
    DomainDetailsDemoComponent,
    DomainDetailsHistoricalComponent,
    DomainDetailsHostedZoneComponent,
    DomainDetailsProxyCategorizaitonComponent,
    DomainDetailsSummaryComponent,
    DomainDetailsTemplateSelectionComponent,
    DominDetailsDnsRecordsComponent,
    DomainListComponent,
    FileUploadDialogComponent,
    LayoutBlankComponent,
    LayoutMainComponent,
    LoginComponent,
    ProgressBarDialog,
    RegisterUserComponent,
    TemplateDetailsComponent,
    TemplateDetailsConnectedDomainsComponent,
    TemplateDetailsDemoComponent,
    TemplateListComponent,
    UserManagementListComponent,
    UserManagementDetailsComponent,
    UserManagementDetailsSummaryComponent,
    UserManagementDetailsGroupsComponent,
    UserManagementDetailsHistoryComponent,
    GenericViewComponent,
    VideoTutorialsComponent,
    HelpMenuComponent,
    ApplicationsDetailsSummaryComponent,
    ApplicationsDetailsDomainsComponent,
    ApplicationsDetailsUsersComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatSortModule,
    MatTableModule,
    ngfModule,
    ReactiveFormsModule,
    VgControlsModule,
    VgCoreModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  providers: [
    AlertsService,
    ApplicationService,
    ApplicationsTabService,
    CategoryService,
    DomainDetailsTabService,
    DomainService,
    HelpService,
    HttpClient,
    LayoutService,
    LoginService,
    TemplateService,
    TemplateDetailsTabService,
    ThemeService,
    UserAuthService,
    UserManagementTabService,
    UserManagementService,
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
