import { Component, OnInit } from '@angular/core';

import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(public layoutSvc: LayoutService) {}

  ngOnInit(): void {
    this.layoutSvc.setTitle('Domain Management Home Page');
  }
}
