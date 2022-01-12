// Angular Imports
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  HostListener,
  ElementRef,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';

// Local Service Imports
import { AlertsService } from 'src/app/services/alerts.service';
import { DomainService } from 'src/app/services/domain.service';
import { EmailService } from 'src/app/services/email.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';

//Models
import { DomainEmailModel } from 'src/app/models/domainEmail.model';
import { DomainEmailListModel } from 'src/app/models/domainEmail.model';

@Component({
  selector: 'dd-emails',
  templateUrl: './domain-details-emails.component.html',
  styleUrls: ['./domain-details-emails.component.scss'],
})
export class DomainDetailsEmailsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  component_subscriptions = [];
  loading = true;
  data = [];

  //Mat Table Items
  emailList = new MatTableDataSource<DomainEmailListModel>();
  email: DomainEmailModel = new DomainEmailModel();
  displayedColumns = ['from_address', 'timestamp'];
  searchInput = '';
  @ViewChild(MatSort) sort: MatSort;
  currDate = new Date();
  bodyDisplay = '<p>Not Set</p>';
  toggleText = 'Toggle On';
  toggleInProcess = false;
  toggleTooltipPosition = 'right';

  //resize
  resizing = false;
  currentXDelta = 6;
  listWidth = '';
  messageWidth = '';
  lastListWidth = 0;
  lastMessageWidth = 0;
  lastFullWidth = 0;
  minimumSize = 120;
  spacerWidth = 12;
  spacerCount = 1;

  @ViewChild('resizeBar') resizeBar: ElementRef;
  @ViewChild('listContainer') listContainer: ElementRef;
  @ViewChild('messageContainer') messageContainer: ElementRef;
  @ViewChild('tabContainer') tabContainer: ElementRef;

  constructor(
    public alertsSvc: AlertsService,
    public datepipe: DatePipe,
    public ddTabSvc: DomainDetailsTabService,
    public emailSvc: EmailService
  ) {}

  ngAfterViewInit(): void {
    if (this.ddTabSvc.hasEmailActive()) {
      this.lastFullWidth = this.tabContainer.nativeElement.offsetWidth;
      this.lastListWidth = this.listContainer.nativeElement.offsetWidth;
    }
    this.addEventListeners();
  }
  ngOnInit(): void {
    this.component_subscriptions.push(
      this.ddTabSvc.getDomainDataBehaviorSubject().subscribe((data) => {
        if (data._id) {
          if (this.ddTabSvc.hasEmailActive()) {
            this.bodyDisplay = '<p>Select an Email to display.</p>';
            this.toggleText = 'Toggle Off';
          } else {
            this.bodyDisplay =
              '<p>This domain is not set to receive emails.</p>';
          }
          this.getEmailList();
          if (this.ddTabSvc.isEmailPending()) {
            this.toggleInProcess = true;
          } else {
            this.toggleInProcess = false;
          }
        }
      })
    );
  }
  toggleStatus() {
    if (this.ddTabSvc.domain_data.is_email_active) {
      this.bodyDisplay = '<p>No emails have been received.</p>';
    } else {
    }
    this.toggleInProcess = true;
    this.ddTabSvc.domain_data.is_email_active =
      !this.ddTabSvc.domain_data.is_email_active;
    this.emailSvc
      .setDomainEmailsStatus(
        this.ddTabSvc.domain_data._id,
        this.ddTabSvc.domain_data.is_email_active
      )
      .subscribe(
        (success: any) => {
          this.toggleInProcess = true;
          this.alertsSvc.alert(success.message);
          this.changeToggleStatus();
        },
        (failure) => {
          this.toggleInProcess = false;
          this.alertsSvc.alert(
            'Failed to change status, please try again later.'
          );
        }
      );
  }
  changeToggleStatus() {
    if (this.toggleText == 'Toggle Off') {
      this.toggleText = 'Toggle On';
      // this.lastFullWidth = this.tabContainer.nativeElement.offsetWidth;
      // this.lastListWidth = this.listContainer.nativeElement.offsetWidth;
    } else {
      this.toggleText = 'Toggle Off';
    }
  }

  addReadableDate(data) {
    const dayInMilliseconds = 86400000;
    const hourInMilliseconds = 3600000;
    const minuteInMilliseconds = 60000;

    data.forEach((item) => {
      let workingDate = new Date(item.timestamp);
      let timeDeltaInMilliseconds =
        this.currDate.getTime() - workingDate.getTime();
      let timeDeltaInDays = this.currDate.getDate() - workingDate.getDate();
      //Take the millisecond time val and subtract
      //the current days time in milliseconds
      let TimeOfStartOfDay =
        this.currDate.getTime() -
        (this.currDate.getHours() * hourInMilliseconds +
          this.currDate.getMinutes() * minuteInMilliseconds +
          this.currDate.getMilliseconds());
      if (timeDeltaInMilliseconds < 0) {
        item['readableDate'] = 'now';
      }
      //Current day
      else if (workingDate.getTime() > TimeOfStartOfDay) {
        if (workingDate.getHours() < 12) {
          item[
            'readableDate'
          ] = `${workingDate.getHours()}:${workingDate.getMinutes()} am`;
        } else {
          item['readableDate'] = `${
            workingDate.getHours() - 12
          }:${workingDate.getMinutes()} pm`;
        }
      } else if (
        workingDate.getTime() < TimeOfStartOfDay &&
        workingDate.getTime() > TimeOfStartOfDay - dayInMilliseconds
      ) {
        item['readableDate'] = 'Yesterday';
      } else {
        item['readableDate'] = this.datepipe.transform(
          workingDate,
          'MM-dd-yyyy HH:MM'
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
    this.component_subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
  //Resize Methods
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeWindow();
  }

  dragToResize(e) {
    if (this.resizing) {
      this.currentXDelta += e.movementX;
      if (
        this.messageContainer.nativeElement.offsetWidth - e.movementX >
          this.minimumSize &&
        this.listContainer.nativeElement.offsetWidth + e.movementX >
          this.minimumSize
      ) {
        this.messageWidth = `${
          this.messageContainer.nativeElement.offsetWidth - e.movementX
        }px`;
        this.listWidth = `${
          this.listContainer.nativeElement.offsetWidth + e.movementX
        }px`;
      }
    }
  }
  setRestingWidths() {
    //get Initial width
    this.lastFullWidth = this.tabContainer.nativeElement.offsetWidth;
    this.lastListWidth = this.listContainer.nativeElement.offsetWidth;
    this.lastMessageWidth = this.messageContainer.nativeElement.offsetWidth;
  }
  resizeWindow() {
    let currWorkingWidth = this.tabContainer.nativeElement.offsetWidth;

    let ratio = currWorkingWidth / this.lastFullWidth;
    let newListWidth = Math.round(this.lastListWidth * ratio);
    let newMessageWidth = Math.round(this.lastMessageWidth * ratio);

    //Determine the margin of error caused by using a ratio
    //to calculate a integer pixel value
    let marginOfError = newListWidth + newMessageWidth + 12 - currWorkingWidth;

    //Get an even margin of error value , accounting
    //for the difference by removing it from the list width
    if (marginOfError % 2 != 0) {
      marginOfError -= 1;
      newListWidth -= 1;
    }
    newListWidth -= marginOfError / 2;
    newMessageWidth -= marginOfError / 2;

    if (newListWidth <= this.minimumSize) {
      newMessageWidth += this.minimumSize - newListWidth;
      newListWidth = this.minimumSize;
    }
    if (newMessageWidth <= this.minimumSize) {
      newListWidth -= this.minimumSize - newMessageWidth;
      newMessageWidth = this.minimumSize;
    }

    //Keep a window from hitting 0 (or a specified minimum size) to
    //prevent the display from droping to a new row or not showing at all
    let remainingSpacerWidth =
      currWorkingWidth - (newListWidth + newMessageWidth);
    if (remainingSpacerWidth != this.spacerWidth * this.spacerCount) {
      let amountOffSpacerRequirements =
        remainingSpacerWidth - this.spacerWidth * this.spacerCount;
      if (newListWidth > newMessageWidth) {
        newListWidth += amountOffSpacerRequirements;
      }
      if (newMessageWidth > newListWidth) {
        newMessageWidth += amountOffSpacerRequirements;
      }
    }

    this.listWidth = `${newListWidth}px`;
    this.messageWidth = `${newMessageWidth}px`;
  }
  addEventListeners() {
    if (this.ddTabSvc.hasEmailActive()) {
      this.resizeBar.nativeElement.addEventListener('mousedown', (e) => {
        this.resizing = true;
      });
      this.tabContainer.nativeElement.addEventListener('mousemove', (e) => {
        this.dragToResize(e);
      });
      this.tabContainer.nativeElement.addEventListener('mouseleave', (e) => {
        this.resizing = false;
        this.setRestingWidths();
      });
      this.tabContainer.nativeElement.addEventListener('mouseup', (e) => {
        this.resizing = false;
        this.setRestingWidths();
      });
    }
  }
  removeEventListeners() {
    if (this.resizeBar) {
      this.resizeBar.nativeElement.removeEventListener('mousedown', (e) => {
        this.resizing = true;
      });
      this.tabContainer.nativeElement.removeEventListener('mousemove', (e) => {
        this.dragToResize(e);
      });
      this.tabContainer.nativeElement.removeEventListener('mouseleave', (e) => {
        this.resizing = false;
        this.setRestingWidths();
      });
      this.tabContainer.nativeElement.removeEventListener('mouseup', (e) => {
        this.resizing = false;
        this.setRestingWidths();
      });
    }
  }
  getEmail(emailId) {
    this.emailList.data.forEach((item) => {
      if (item._id == emailId) {
        item.is_read = true;
      }
    });
    this.emailSvc.getDomainEmail(emailId).subscribe(
      (data) => {
        this.email = data as DomainEmailModel;
        this.bodyDisplay = this.email.message;
      },
      (failure) => {
        this.alertsSvc.alert('Failed to get email');
      }
    );
  }

  getEmailList() {
    this.emailSvc.getDomainEmails(this.ddTabSvc.domain_data._id).subscribe(
      (success) => {
        if (!success[0] && this.ddTabSvc.hasEmailActive()) {
          this.bodyDisplay = '<p>No emails have been received.</p>';
        }
        this.addReadableDate(success);
        this.emailList.data = success as Array<DomainEmailListModel>;
        this.emailList.sort = this.sort;

        if (this.ddTabSvc.domain_data.is_email_active) {
          const sortState: Sort = { active: 'timestamp', direction: 'desc' };
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
        }
      },
      (failure) => {
        console.log(failure);
        this.alertsSvc.alert('Failed to get email list');
      }
    );
  }

  refreshEmailList() {
    this.emailSvc.getDomainEmails(this.ddTabSvc.domain_data._id).subscribe(
      (success) => {
        if (!success[0] && this.ddTabSvc.hasEmailActive()) {
          this.bodyDisplay = '<p>No emails have been received.</p>';
        }
        this.addReadableDate(success);
        this.emailList.data = success as Array<DomainEmailListModel>;
        this.emailList.sort = this.sort;

        if (this.ddTabSvc.domain_data.is_email_active) {
          const sortState: Sort = { active: 'timestamp', direction: 'desc' };
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
        }
      },
      (failure) => {
        console.log(failure);
        this.alertsSvc.alert('Failed to get email list');
      }
    );
  }

  deleteEmail(emailId) {
    this.emailSvc.deleteDomainEmail(emailId).subscribe(
      (success) => {
        this.emailList.data = this.emailList.data.filter(
          (email) => email._id !== emailId
        );
        this.bodyDisplay = '';
        this.email._id = null;
      },
      (failure) => {
        this.alertsSvc.alert(failure);
      }
    );
  }
}
