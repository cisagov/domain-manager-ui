import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-generic-view',
  templateUrl: './generic-view.component.html',
  styleUrls: ['./generic-view.component.scss'],
})
export class GenericViewComponent implements OnInit {
  displayData: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    Object.keys(this.data).forEach((key) => {
      let value = this.data[key];
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      this.displayData.push({ key, value });
    });
  }
}
