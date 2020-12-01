import { Component, OnInit } from '@angular/core';

import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'dmCustomAttributesTab',
  templateUrl: './domain-management-custom-attributes.component.html',
})
export class DomainManagementCustomAttributesTab implements OnInit {
  constructor(
    public layoutSvc: LayoutService
    ) {}

  ngOnInit(): void {
  }
}
