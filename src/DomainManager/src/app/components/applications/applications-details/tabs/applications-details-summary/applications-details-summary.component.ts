import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Local Service Imports
import { ApplicationsTabService } from 'src/app/services/tab-services/applications-details-tab.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-applications-details-summary',
  templateUrl: './applications-details-summary.component.html',
  styleUrls: ['./applications-details-summary.component.scss'],
})
export class ApplicationsDetailsSummaryComponent implements OnInit {
  app_id: string;
  component_subscriptions = [];
  editButtonText: String = 'Edit';
  editMode: Boolean = false;

  applicationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    contactName: new FormControl(),
    contactEmail: new FormControl('', [Validators.email]),
    contactPhone: new FormControl(),
  });

  constructor(
    public activeRoute: ActivatedRoute,
    public appTabSvc: ApplicationsTabService,
    public layoutSvc: LayoutService,
  ) {
    this.layoutSvc.setTitle('Application Details');
  }

  ngOnInit(): void {
    this.appTabSvc.init();

    this.appTabSvc.getApplicationUpdateBehvaiorSubject().subscribe((item) => {
      if (item._id) {
        this.layoutSvc.setTitle(`Application: ${item.name}`);
        this.setForm(item);
      }
    });

    this.component_subscriptions.push(
      this.activeRoute.params.subscribe((params) => {
        this.app_id = params['_id'];
        if (this.app_id !== null) {
          this.appTabSvc.getApplication(this.app_id);
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  setForm(application) {
    this.applicationForm.controls.name.setValue(application.name);
    this.applicationForm.controls.contactName.setValue(
      application.contact_name,
    );
    this.applicationForm.controls.contactEmail.setValue(
      application.contact_email,
    );
    this.applicationForm.controls.contactPhone.setValue(
      application.contact_phone,
    );
  }

  updateApplication() {
    this.appTabSvc.updateApplication();
  }

  changeEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.editButtonText = 'Save';
    } else {
      this.updateApplication();
      this.editButtonText = 'Edit';
    }
  }
}
