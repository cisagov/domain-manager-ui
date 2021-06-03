// Angular Imports
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-applications-details',
  templateUrl: './applications-details.component.html',
  styleUrls: ['./applications-details.component.scss'],
})
export class ApplicationsDetailsComponent implements OnInit {
  selectedTabIndex: number = 0;

  constructor(public activeRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  onTabChanged(event) {}
}
