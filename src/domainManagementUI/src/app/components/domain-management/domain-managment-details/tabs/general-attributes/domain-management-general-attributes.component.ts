import { Component, OnInit } from '@angular/core';

import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'dmGeneralAttributesTab',
  templateUrl: './domain-management-general-attributes.component.html',
})
export class DomainManagementGeneralAttributesTab implements OnInit {
  constructor(
    public layoutSvc: LayoutService
    ) {}

  ngOnInit(): void {
  }
}
