import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { range } from 'rxjs';
import { GenericDialogSettings } from 'src/app/models/genericDialogSettings.model';

@Component({
  selector: 'app-generic-view',
  templateUrl: './generic-view.component.html',
  styleUrls: ['./generic-view.component.scss'],
})
export class GenericViewComponent implements OnInit {
  displayData: any[] = [];
  keyHeader = 'Key';
  valueHeader = 'Value';

  constructor(@Inject(MAT_DIALOG_DATA) public data: GenericDialogSettings) {}

  ngOnInit(): void {
    // Set headers
    this.keyHeader = this.data.keyHeader;
    this.valueHeader = this.data.valueHeader;

    // Set display data
    Object.keys(this.data.data).forEach((key) => {
      let value = this.data.data[key];
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      this.displayData.push({ key, value });
    });
  }

  test(): void {
    this.displayData = [];
    const numbers = range(1, 300);
    numbers.forEach((num) => {
      this.displayData.push({ key: `something_${num}`, value: 'test' });
    });
  }
}
