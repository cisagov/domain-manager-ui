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
import { DatePipe } from '@angular/common';
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
import { CategorizationComponent } from './components/categorization/categorization.component';
import { CategorizationRejectDialogComponent } from './components/categorization/categorization-reject-dialog/categorization-reject-dialog.component';
import { CategorizationSubmitComponent } from './components/categorization/tabs/categorization-submit/categorization-submit.component';
import { CategorizationVerifyComponent } from './components/categorization/tabs/categorization-verify/categorization-verify.component';
import { ConfirmCategoryDialogComponent } from './components/dialog-windows/confirm-categorize/confirm-categorize-dialog.component';
import { ConfirmDialogComponent } from 'src/app/components/dialog-windows/confirm/confirm-dialog.component';
import { DnsRecordsDialogComponent } from './components/domain/domain-details/tabs/dns-records/dns-records-dialog/dns-records-dialog.component';
import { DomainCreateDialogComponent } from 'src/app/components/domain/domain-create-dialog/domain-create-dialog.component';
import { DomainDetailsComponent } from 'src/app/components/domain/domain-details/domain-details.component';
import { DomainDetailsAttrbutesComponent } from 'src/app/components/domain/domain-details/tabs/attributes/domain-details-attributes.component';
import { DomainDetailsDemoComponent } from 'src/app/components/domain/domain-details/tabs/demo/domain-details-demo.component';
import { DomainDetailsEmailsComponent } from 'src/app/components/domain/domain-details/tabs/domain-emails/domain-details-emails.component';
import { DomainDetailsHistoricalComponent } from 'src/app/components/domain/domain-details/tabs/historical/domain-details-historical.component';
import { DomainDetailsHostedZoneComponent } from 'src/app/components/domain/domain-details/tabs/hosted-zone/domain-details-hosted-zone.component';
import { DomainDetailsProxyCategorizationComponent } from 'src/app/components/domain/domain-details/tabs/proxy-categorization/domain-details-proxy-categorization.component';
import { DomainDetailsSummaryComponent } from 'src/app/components/domain/domain-details/tabs/summary/domain-details-summary.component';
import { DomainDetailsTemplateSelectionComponent } from 'src/app/components/domain/domain-details/tabs/template-selection/domain-details-template-selection.component';
import { DominDetailsDnsRecordsComponent } from './components/domain/domain-details/tabs/dns-records/domain-details-dns-records.component';
import { DomainListComponent } from 'src/app/components/domain/domain-list/domain-list.component';
import { FileUploadDialogComponent } from 'src/app/components/dialog-windows/file-upload/file-upload-dialog.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LayoutBlankComponent } from 'src/app/components/layout/layout-blank/layout-blank.component';
import { LayoutMainComponent } from 'src/app/components/layout/layout-main/layout-main.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
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
import { VerifyCategoryDialogComponent } from './components/dialog-windows/verify-category/verify-category-dialog.component';

//Services
import { AboutService } from './services/about.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { ApplicationService } from 'src/app/services/applications.service';
import { ApplicationsTabService } from 'src/app/services/tab-services/applications-details-tab.service';
import { CategorizationTabService } from 'src/app/services/tab-services/categorization-tabs.service';
import { CategoryService } from 'src/app/services/category.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';
import { DomainService } from 'src/app/services/domain.service';
import { EmailService } from 'src/app/services/email.service';
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

//Helpers
import { AboutComponent } from './components/about/about.component';
import { ApplicationsDetailsDomainsComponent } from './components/applications/applications-details/tabs/applications-details-domains/applications-details-domains.component';
import { ApplicationsDetailsSummaryComponent } from './components/applications/applications-details/tabs/applications-details-summary/applications-details-summary.component';
import { ApplicationsDetailsUsersComponent } from './components/applications/applications-details/tabs/applications-details-users/applications-details-users.component';
import { AuthAppendInterceptor } from 'src/app/helpers/AuthAppendInterceptor';
import { GenericViewComponent } from './components/dialog-windows/generic-view/generic-view.component';
import { HelpMenuComponent } from './components/help/help-menu/help-menu.component';
import { UnauthorizedInterceptor } from 'src/app/helpers/UnauthorizedInterceptor';
import { VideoTutorialsComponent } from './components/help/video-tutorials/video-tutorials.component';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';

export function app_Init(settingsHttpService: SettingsHttpService) {
  return () => settingsHttpService.initializeApp();
}

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    ApplicationsDetailsComponent,
    ApplicationEditDialogComponent,
    ApplicationListComponent,
    CategorizationComponent,
    CategorizationRejectDialogComponent,
    CategorizationSubmitComponent,
    CategorizationVerifyComponent,
    ConfirmCategoryDialogComponent,
    ConfirmDialogComponent,
    DnsRecordsDialogComponent,
    DomainCreateDialogComponent,
    DomainDetailsComponent,
    DomainDetailsAttrbutesComponent,
    DomainDetailsDemoComponent,
    DomainDetailsEmailsComponent,
    DomainDetailsHistoricalComponent,
    DomainDetailsHostedZoneComponent,
    DomainDetailsProxyCategorizationComponent,
    DomainDetailsSummaryComponent,
    DomainDetailsTemplateSelectionComponent,
    DominDetailsDnsRecordsComponent,
    DomainListComponent,
    FileUploadDialogComponent,
    ForgotPasswordComponent,
    LayoutBlankComponent,
    LayoutMainComponent,
    LoginComponent,
    PasswordResetComponent,
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
    VerifyCategoryDialogComponent,
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
    AboutService,
    AlertsService,
    ApplicationService,
    ApplicationsTabService,
    CategorizationTabService,
    CategoryService,
    DatePipe,
    DomainDetailsTabService,
    DomainService,
    EmailService,
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
