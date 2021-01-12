//Angular Imports
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'domain-create',
  templateUrl: 'domain-create-dialog.component.html',
})
export class DomainCreateDialog implements OnInit {

  domain_form_group: FormGroup;

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DomainCreateDialog>
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }
  closeDialog() {
    this.dialogRef.close(false);
  }

  createDomain() {
    if (this.isValid(this.domain_form_group)) {
      this.dialogRef.close(this.controls['url'].value);
    } else {
      console.log('invlid form');
    }
  }

  buildForm() {
    this.domain_form_group = new FormGroup({
      url: new FormControl('', {
        validators: Validators.required,
      }),
    });
  }

  isValid(form: FormGroup) {
    if (form.valid) {
      return true;
    } else {
      form.markAllAsTouched();
      return false;
    }
  }

  get controls() {
    return this.domain_form_group.controls;
  }
}
