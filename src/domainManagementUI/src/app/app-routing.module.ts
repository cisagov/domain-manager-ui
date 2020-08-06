import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DomainManagementDetailsComponent } from 'src/app/components/domain-management/domain-managment-details/domain-management-details.component';
import { DomainManagementListComponent } from 'src/app/components/domain-management/domain-management-list/domain-management-list.component';
import { DomainUtilizedListComponent } from 'src/app/components/domain-utilization/domain-utilization-list/domain-utilization-list.component';
import { DomainUtilizedDetailsComponent } from 'src/app/components/domain-utilization/domain-utilization-details/domain-utilization-details.component';
import { WebsiteTemplateDetailsComponent } from 'src/app/components/webstie-templates/website-templates-details/website-templates-details.component';
import { WebsiteTemplatesListComponent } from 'src/app/components/webstie-templates/website-templates-list/website-templates-list.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { LayoutMainComponent } from 'src/app/components/layout/layout-main/layout-main.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutMainComponent,
    children: [{ path: '', component: HomeComponent }],
  },
  {
    path: 'home',
    component: LayoutMainComponent,
    children: [{ path: '', component: HomeComponent }],
  },
  {
    path: 'domain-management',
    component: LayoutMainComponent,
    children: [{ path: '', component: DomainManagementListComponent }],
  },
  {
    path: 'domain-management/details/:domain_uuid',
    component: LayoutMainComponent,
    children: [{ path: '', component: DomainManagementDetailsComponent }],
  },
  {
    path: 'website-templates',
    component: LayoutMainComponent,
    children: [{ path: '', component: WebsiteTemplatesListComponent }],
  },
  {
    path: 'website-templates/details/:website_template_uuid',
    component: LayoutMainComponent,
    children: [{ path: '', component: WebsiteTemplateDetailsComponent }],
  },
  {
    path: 'domains-utilized',
    component: LayoutMainComponent,
    children: [{ path: '', component: DomainUtilizedListComponent }],
  },
  {
    path: 'domains-utilized/details/:domain_utilized_uuid',
    component: LayoutMainComponent,
    children: [{ path: '', component: DomainUtilizedDetailsComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
