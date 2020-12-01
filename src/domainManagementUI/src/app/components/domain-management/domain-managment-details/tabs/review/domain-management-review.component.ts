import { Component, OnInit } from '@angular/core';

import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'dmReviewTab',
  templateUrl: './domain-management-review.component.html',
})
export class DomainManagementReviewTab implements OnInit {
  constructor(
    public layoutSvc: LayoutService
    ) {}

  ngOnInit(): void {
  }
}
