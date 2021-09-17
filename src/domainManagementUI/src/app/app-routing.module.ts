import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { ApplicationsDetailsComponent } from 'src/app/components/applications/applications-details/applications-details.component';
import { ApplicationListComponent } from 'src/app/components/applications/applications-list/application-list.component';
import { CategorizationComponent } from './components/categorization/categorization.component';
import { DomainDetailsComponent } from 'src/app/components/domain/domain-details/domain-details.component';
import { DomainListComponent } from 'src/app/components/domain/domain-list/domain-list.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HelpMenuComponent } from 'src/app/components/help/help-menu/help-menu.component';
import { LayoutMainComponent } from 'src/app/components/layout/layout-main/layout-main.component';
import { LayoutBlankComponent } from 'src/app/components/layout/layout-blank/layout-blank.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { RegisterUserComponent } from 'src/app/components/register/register-user.component';
import { TemplateDetailsComponent } from 'src/app/components/template/template-details/template-details.component';
import { TemplateListComponent } from 'src/app/components/template/template-list/template-list.component';
import { UserManagementListComponent } from 'src/app/components/user-managment/user-management-list/user-management-list.component';
import { UserManagementDetailsComponent } from 'src/app/components/user-managment/user-management-details/user-management-details.component';
import { VideoTutorialsComponent } from 'src/app/components/help/video-tutorials/video-tutorials.component';

// Guards
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: DomainListComponent }],
  },
  {
    path: 'about',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: AboutComponent }],
  },
  {
    path: 'application',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: ApplicationListComponent }],
  },
  {
    path: 'application/details/:_id',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: ApplicationsDetailsComponent }],
  },
  {
    path: 'categorization',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: CategorizationComponent }],
  },
  {
    path: 'domain',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: DomainListComponent }],
  },
  {
    path: 'domain/details/:_id',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: DomainDetailsComponent }],
  },
  {
    path: 'help',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: HelpMenuComponent }],
  },
  {
    path: 'login',
    component: LayoutBlankComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'registeruser', component: RegisterUserComponent },
      { path: 'forgotpassword', component: ForgotPasswordComponent },
    ],
  },
  {
    path: 'template',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: TemplateListComponent }],
  },
  {
    path: 'template/details/:_id',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: TemplateDetailsComponent }],
  },
  {
    path: 'users',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: UserManagementListComponent }],
  },
  {
    path: 'user/details/:username',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: UserManagementDetailsComponent }],
  },
  {
    path: 'video-tutorials',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: VideoTutorialsComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
