import { Component } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-categorization-list',
  templateUrl: './categorization-list.component.html',
  styleUrls: ['./categorization-list.component.scss'],
})
export class CategorizationListComponent {
  constructor(public layoutSvc: LayoutService) {
    this.layoutSvc.setTitle('Categorizations');
  }
}
