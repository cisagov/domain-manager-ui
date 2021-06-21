import { Component, OnInit } from '@angular/core';
import { AboutModel } from 'src/app/models/about.model';
import { AboutService } from 'src/app/services/about.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-about-page',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  aboutData = new AboutModel();
  constructor(public aboutSvc: AboutService, public layoutSvc: LayoutService) {
    this.layoutSvc.setTitle('About');
  }

  ngOnInit(): void {
    this.getAbout();
  }

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {}

  getAbout() {
    this.aboutSvc.getAbout().subscribe(
      (success) => {
        this.aboutData = success as AboutModel;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
