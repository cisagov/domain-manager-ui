import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { AboutComponent } from 'src/app/components/about/about.component';
import { ApplicationDetailsComponent } from 'src/app/components/applications/application-details/application-details.component'
import { ApplicationListComponent } from 'src/app/components/applications/applications-list/application-list.component';
import { DomainManagementDetailsComponent } from 'src/app/components/domain-management/domain-managment-details/domain-management-details.component';
import { DomainManagementListComponent } from 'src/app/components/domain-management/domain-management-list/domain-management-list.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { LayoutMainComponent } from 'src/app/components/layout/layout-main/layout-main.component';
import { TemplateDetailsComponent } from 'src/app/components/template/template-details/template-details.component'
import { TemplateListComponent } from 'src/app/components/template/template-list/template-list.component'
import { WebsiteDetailsComponent } from 'src/app/components/website/website-details/website-details.component';
import { WebsiteListComponent } from 'src/app/components/website/website-list/website-list.component';
import { WebsiteCreationComponent } from 'src/app/components/website/website-creation/website-creation.component';

//Guards
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutMainComponent,
    children: [{ path: '', component: HomeComponent }],
  },
  {
    path: 'about',
    component: LayoutMainComponent,
    children: [{ path: '', component: AboutComponent }],
  },
  {
    path: 'application',
    component: LayoutMainComponent,
    children: [{ path: '', component: ApplicationListComponent }],
  },
  {
    path: 'application/details/:application_uuid',
    component: LayoutMainComponent,
    children: [{ path: '', component: ApplicationDetailsComponent }],
  },
  {
    path: 'domain-management',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [{ path: '', component: DomainManagementListComponent }],
  },
  {
    path: 'domain-management/details/:domain_uuid',
    component: LayoutMainComponent,
    children: [{ path: '', component: DomainManagementDetailsComponent }],
  },
  {
    path: 'home',
    component: LayoutMainComponent,
    children: [{ path: '', component: HomeComponent }],
  },
  {
    path: 'template',
    component: LayoutMainComponent,
    children: [{ path: '', component: TemplateListComponent }],
  },
  {
    path: 'template/details/:template_uuid',
    component: LayoutMainComponent,
    children: [{ path: '', component: TemplateDetailsComponent }],
  },
  {
    path: 'website',
    component: LayoutMainComponent,
    children: [{ path: '', component: WebsiteListComponent }],
  },
  {
    path: 'website/creation',
    component: LayoutMainComponent,
    children: [{ path: '', component: WebsiteCreationComponent }],
  },
  {
    path: 'website/creation/:template_uuid',
    component: LayoutMainComponent,
    children: [{ path: '', component: WebsiteCreationComponent }],
  },
  {
    path: 'website/details/:website_uuid',
    component: LayoutMainComponent,
    children: [{ path: '', component: WebsiteDetailsComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
