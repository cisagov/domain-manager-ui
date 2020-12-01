import { Component, OnInit } from '@angular/core';

import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'dmTemplateSelectionTab',
  templateUrl: './domain-management-template-selection.component.html',
})
export class DomainManagementTemplateSelectionTab implements OnInit {
  constructor(
    public layoutSvc: LayoutService
    ) {}

  ngOnInit(): void {
    console.log("test")
  }
}
