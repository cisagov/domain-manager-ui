import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { ApplicationListComponent } from 'src/app/components/applications/applications-list/application-list.component';
import { DomainDetailsComponent } from 'src/app/components/domain/domain-details/domain-details.component';
import { DomainListComponent } from 'src/app/components/domain/domain-list/domain-list.component';
import { LayoutMainComponent } from 'src/app/components/layout/layout-main/layout-main.component';
import { LayoutBlankComponent } from 'src/app/components/layout/layout-blank/layout-blank.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { RegisterUserComponent } from 'src/app/components/register/register-user.component';
import { TemplateDetailsComponent } from 'src/app/components/template/template-details/template-details.component';
import { TemplateListComponent } from 'src/app/components/template/template-list/template-list.component';
import { UserManagementListComponent } from 'src/app/components/user-managment/user-management-list/user-management-list.component';
import { UserManagementDetailsComponent } from 'src/app/components/user-managment/user-management-details/user-management-details.component';

// Guards
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: DomainListComponent }],
  },
  {
    path: 'application',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: ApplicationListComponent }],
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
    path: 'login',
    component: LayoutBlankComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'registeruser', component: RegisterUserComponent },
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
