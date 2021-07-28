// Angular Imports
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit,HostListener, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Local Service Imports
import { DomainService } from 'src/app/services/domain.service';
import { DomainDetailsTabService } from 'src/app/services/tab-services/domain-details-tabs.service';

//Models
import { DomainEmailModel } from 'src/app/models/domainEmail.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'dd-emails',
  templateUrl: './domain-details-emails.component.html',
  styleUrls: ['./domain-details-emails.component.scss'],
})
export class DomainDetailsEmailsComponent implements OnInit, OnDestroy, AfterViewInit {

  component_subscriptions = [];
  loading = true;
  data = [];
  
  //Mat Table Items
  emailList = new MatTableDataSource<DomainEmailModel>();
  displayedColumns = ['emailName', 'date','select'];
  searchInput = '';
  @ViewChild(MatSort) sort: MatSort;
  
  //resize
  resizing = false;
  currentXDelta = 6;
  listWidth = "";
  messageWidth = "";
  lastListWidth = 0;
  lastMessageWidth = 0;
  lastFullWidth = 0;
  minimumSize = 120;
  spacerWidth = 12;
  spacerCount =1;

  @ViewChild('resizeBar') resizeBar: ElementRef
  @ViewChild('listContainer') listContainer: ElementRef
  @ViewChild('messageContainer') messageContainer: ElementRef
  @ViewChild('tabContainer') tabContainer: ElementRef

  constructor(
    public ddTabSvc: DomainDetailsTabService,
    public sanitizer: DomSanitizer,
    ) {}

  ngAfterViewInit(): void {
    this.lastFullWidth = this.tabContainer.nativeElement.offsetWidth
    this.lastListWidth = this.listContainer.nativeElement.offsetWidth
    this.addEventListeners();
  }
  ngOnInit(): void {
    this.component_subscriptions.push(
      this.ddTabSvc.getDomainDataBehaviorSubject().subscribe((data) => {
        if(data._id){
          console.log("Domain loaded - grabbing email data from domain or second api call")
          
          //TEST DATA
          this.data = [
            { 'emailName': 'MyTestEmailOne', 'date': "2021-05-18T16:16:44.363000", 'otherData': 'my other data'},
            { 'emailName': 'MyTestEmailTwo', 'date': "2021-05-14T16:16:44.363000", 'otherData': 'some other stuff'},
            { 'emailName': 'MyTestEmailThree', 'date': "2021-05-15T16:16:44.363000", 'otherData': 'last'},
          ]
          this.emailList.data = this.data as Array<DomainEmailModel>;
          this.emailList.sort = this.sort;
        }
      })
    )
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

  dragToResize(e){
    if(this.resizing){
      this.currentXDelta += e.movementX
      if(
        (this.messageContainer.nativeElement.offsetWidth - e.movementX > this.minimumSize) &&
        (this.listContainer.nativeElement.offsetWidth + e.movementX > this.minimumSize) 
        ){
          this.messageWidth = `${this.messageContainer.nativeElement.offsetWidth - e.movementX}px`;
          this.listWidth = `${this.listContainer.nativeElement.offsetWidth + e.movementX}px`;
        }
    }

  }
  setRestingWidths(){
    //get Initial width
    this.lastFullWidth = this.tabContainer.nativeElement.offsetWidth
    this.lastListWidth = this.listContainer.nativeElement.offsetWidth
    this.lastMessageWidth = this.messageContainer.nativeElement.offsetWidth
  }
  resizeWindow(){
    let currWorkingWidth = this.tabContainer.nativeElement.offsetWidth
    
    let ratio = currWorkingWidth / this.lastFullWidth 
    let newListWidth = Math.round(this.lastListWidth * ratio)
    let newMessageWidth = Math.round(this.lastMessageWidth * ratio)

    //Determine the margin of error caused by using a ratio 
    //to calculate a integer pixel value
    let marginOfError = (newListWidth + newMessageWidth + 12) - currWorkingWidth 
    
    //Get an even margin of error value , accounting 
    //for the difference by removing it from the list width
    if(marginOfError % 2 != 0){
      marginOfError -= 1;
      newListWidth -=1;
    }
    newListWidth -= marginOfError / 2
    newMessageWidth -= marginOfError / 2

    if(newListWidth <= this.minimumSize){
      newMessageWidth += this.minimumSize - newListWidth
      newListWidth = this.minimumSize
    }
    if(newMessageWidth <= this.minimumSize){
      newListWidth -= this.minimumSize - newMessageWidth
      newMessageWidth = this.minimumSize
    }

    //Keep a window from hitting 0 (or a specified minimum size) to 
    //prevent the display from droping to a new row or not showing at all
    let remainingSpacerWidth = currWorkingWidth - (newListWidth + newMessageWidth);
    if(remainingSpacerWidth != this.spacerWidth * this.spacerCount){
      let amountOffSpacerRequirements = remainingSpacerWidth - (this.spacerWidth * this.spacerCount)
      if(newListWidth > newMessageWidth){
        newListWidth += amountOffSpacerRequirements;
      }
      if(newMessageWidth > newListWidth){
        newMessageWidth += amountOffSpacerRequirements;
      }
    }

    this.listWidth = `${newListWidth}px`
    this.messageWidth = `${newMessageWidth}px`
  }
  addEventListeners(){
    this.resizeBar.nativeElement.addEventListener(
      'mousedown', (e) =>{
        this.resizing = true;
      }
    )
    this.tabContainer.nativeElement.addEventListener(
      'mousemove', (e) =>{
        this.dragToResize(e)
      }
    )
    this.tabContainer.nativeElement.addEventListener(
      'mouseleave', (e) =>{
        this.resizing = false;
        this.setRestingWidths();
      }
    )
    this.tabContainer.nativeElement.addEventListener(
      'mouseup', (e) =>{
        this.resizing = false;
        this.setRestingWidths();
      }
    )
  }
  removeEventListeners(){
    this.resizeBar.nativeElement.removeEventListener(
      'mousedown', (e) =>{
        this.resizing = true;
      }
    )
    this.tabContainer.nativeElement.removeEventListener(
      'mousemove', (e) =>{
        this.dragToResize(e)
      }
    )
    this.tabContainer.nativeElement.removeEventListener(
      'mouseleave', (e) =>{
        this.resizing = false;
        this.setRestingWidths();
      }
    )
    this.tabContainer.nativeElement.removeEventListener(
      'mouseup', (e) =>{
        this.resizing = false;
        this.setRestingWidths();
      }
    )
  }

  test(e){
    console.log(e)
  }
}
