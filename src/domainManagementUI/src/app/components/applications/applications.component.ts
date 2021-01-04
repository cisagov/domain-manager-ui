import { Component, OnInit } from '@angular/core';

import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'home',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit {
  constructor(public layoutSvc: LayoutService) {}

  ngOnInit(): void {
    this.layoutSvc.setTitle('Applications');
  }
}
