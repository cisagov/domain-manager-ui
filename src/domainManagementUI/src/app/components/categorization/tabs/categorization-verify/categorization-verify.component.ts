import { Component } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';
import { CategorizationTabService } from 'src/app/services/tab-services/categorization-tabs.service';
@Component({
  selector: 'app-categorization-verify',
  templateUrl: './categorization-verify.component.html',
  styleUrls: ['./categorization-verify.component.scss'],
})
export class CategorizationVerifyComponent {
  constructor(
    public layoutSvc: LayoutService,
    public categorizationTabSvc: CategorizationTabService
  ) {
    this.layoutSvc.setTitle('Categorizations');
  }
}
