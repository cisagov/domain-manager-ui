import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { AboutComponent } from 'src/app/components/about/about.component';
import { ApplicationsComponent } from 'src/app/components/applications/applications.component';
import { DomainManagementDetailsComponent } from 'src/app/components/domain-management/domain-managment-details/domain-management-details.component';
import { DomainManagementListComponent } from 'src/app/components/domain-management/domain-management-list/domain-management-list.component';
import { WebsiteDetailsComponent } from 'src/app/components/website/website-details/website-details.component';
import { WebsiteListComponent } from 'src/app/components/website/website-list/website-list.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { LayoutMainComponent } from 'src/app/components/layout/layout-main/layout-main.component';

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
    path: 'applications',
    component: LayoutMainComponent,
    children: [{ path: '', component: ApplicationsComponent }],
  },
  {
    path: 'home',
    component: LayoutMainComponent,
    children: [{ path: '', component: HomeComponent }],
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
    path: 'website',
    component: LayoutMainComponent,
    children: [{ path: '', component: WebsiteListComponent }],
  },
  {
    path: 'website/details/:website_template_uuid',
    component: LayoutMainComponent,
    children: [{ path: '', component: WebsiteDetailsComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
