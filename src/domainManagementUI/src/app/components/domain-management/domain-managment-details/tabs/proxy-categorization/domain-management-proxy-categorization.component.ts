import { Component, OnInit } from '@angular/core';

import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'dmProxyCategorizaitonTab',
  templateUrl: './domain-management-proxy-categorization.component.html',
})
export class DomainManagementProxyCategorizaitonTab implements OnInit {
  constructor(
    public layoutSvc: LayoutService
    ) {}

  ngOnInit(): void {
  }
}
