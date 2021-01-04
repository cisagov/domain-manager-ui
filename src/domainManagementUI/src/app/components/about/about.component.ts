import { Component, OnInit } from '@angular/core';

import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'home',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  constructor(public layoutSvc: LayoutService) {}

  ngOnInit(): void {
    this.layoutSvc.setTitle('About Page');
  }
}
