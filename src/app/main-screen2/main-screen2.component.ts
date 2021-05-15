import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MainSectionGroup, projectControls, projectFlags, projectSub, projectVariables,TestcaseInfo, UserdataService, userProfile } from '../service/userdata.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith, withLatestFrom } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/app';
import {CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MediaChange, MediaObserver } from '@angular/flex-layout';



@Component({
  selector: 'app-main-screen2',
  templateUrl: './main-screen2.component.html',
  styleUrls: ['./main-screen2.component.scss']
})
export class MainScreen2Component {

  myuserProfile: userProfile = {
    userAuthenObj: null,//Receive User obj after login success

  };

  myprojectControls: projectControls = {
    subsectionkeysControl: new FormControl(null, Validators.required),
    testcaseInfoControl: new FormControl(),
    createTestcaseControl: new FormControl(),
    publicprojectControl: new FormControl(null, Validators.required),
    ownPublicprojectControl: new FormControl(null, Validators.required),
    firstMainSecControl: new FormControl(null, Validators.required),
    editMainsectionGroup: this.fb.group({
      editMainsectionControl: [{ value: '' }, Validators.required]
    }),
    visibilityMainsectionGroup: this.fb.group({
      editVisibilityControl: [{ value: false, disabled: false }, Validators.required]
    }),
    editSubsectionGroup: this.fb.group({
      editSubsectionControl: [{ value: '' }, Validators.required]

    })
  };

  myprojectVariables: projectVariables = {
    initialMainSection: undefined,
    testcaseslength: 0,
    viewSelectedTestcase: undefined,
    publicProjectHint: undefined,
    privateProjectHint: undefined,
    lastSavedVisibility: false,
    editProjectkeysSaved: undefined

  };
  myprojectFlags: projectFlags = {
    showPaymentpage: false,
    newuserCheck: false,
    firstTestcaseEdit: false
  };

  mystartdata;
  subjectstartdata = new BehaviorSubject(undefined);
  getObservablestartdataSub: Subscription = new Subscription;
  getObservablestartdata = (localstartdata: AngularFirestoreDocument<any>) => {
    this.getObservablestartdataSub?.unsubscribe();
    this.getObservablestartdataSub = localstartdata.valueChanges().subscribe((val: any) => {
      this.subjectstartdata.next(val.testcase);
    });
    return this.subjectstartdata;
  };
  SectionTc;
  getTestcasesSubscription: Subscription;
  getTestcasesBehaviourSub = new BehaviorSubject(undefined);
  getTestcases = (TestcaseList: AngularFirestoreDocument<TestcaseInfo>) => {
    if (this.getTestcasesSubscription !== undefined) {
      this.getTestcasesSubscription.unsubscribe();
    }
    this.getTestcasesSubscription = TestcaseList.valueChanges().subscribe((val: any) => {

      if (val === undefined) {
        this.getTestcasesBehaviourSub.next(undefined);
      } else {
        //console.log('85',val.testcase);
        if (val.testcase.length === 0) {

          this.myprojectVariables.testcaseslength = 0;
          this.getTestcasesBehaviourSub.next(null);
        } else {
          if (val.testcase.length !== 0) {
            this.myprojectVariables.testcaseslength = val.testcase.length;
            this.getTestcasesBehaviourSub.next(val.testcase);
          } else {
            //deal witH demo case
          }
        }
      }

    });

    return this.getTestcasesBehaviourSub;
  };
  Sections;
  getSectionsSubscription: Subscription;
  getSectionsBehaviourSub = new BehaviorSubject(undefined);
  getSections = (MainAndSubSectionkeys: AngularFirestoreDocument<MainSectionGroup>) => {
    if (this.getSectionsSubscription !== undefined) {
      this.getSectionsSubscription.unsubscribe();
    }
    this.getSectionsSubscription = MainAndSubSectionkeys.valueChanges().subscribe((val: any) => {
      if (val === undefined) {
        this.getSectionsBehaviourSub.next(undefined);
      } else {
        if (val.MainSection.length === 0) {
          this.getSectionsBehaviourSub.next(null);
        } else {
          if (val.MainSection.length !== 0) {
            this.getSectionsBehaviourSub.next(val.MainSection);
          }
        }
      }
    });
    return this.getSectionsBehaviourSub;
  };
  Process;
  getProcessSubscription: Subscription;
  getProcessBehaviourSub = new BehaviorSubject(undefined);
  getProcess = (MainAndSubSectionkeys: AngularFirestoreDocument<any>) => {
    if (this.getProcessSubscription !== undefined) {
      this.getProcessSubscription.unsubscribe();
    }
    this.getProcessSubscription = MainAndSubSectionkeys.valueChanges().subscribe((val: any) => {
      if (val === undefined) {
        this.getProcessBehaviourSub.next(undefined);
      } else {
        if (val.process?.length === 0) {
          this.getProcessBehaviourSub.next(null);
        } else {
          if (val.process?.length !== 0) {
            this.getProcessBehaviourSub.next(val.process);
          }
        }
      }
    });
    return this.getProcessBehaviourSub;
  };
  Done;
  getDoneSubscription: Subscription;
  getDoneBehaviourSub = new BehaviorSubject(undefined);
  getDone = (MainAndSubSectionkeys: AngularFirestoreDocument<any>) => {
    if (this.getDoneSubscription !== undefined) {
      this.getDoneSubscription.unsubscribe();
    }
    this.getDoneSubscription = MainAndSubSectionkeys.valueChanges().subscribe((val: any) => {
      console.log(val);

      if (val === undefined) {
        this.getDoneBehaviourSub.next(undefined);
      } else {
        if (val.done?.length === 0) {
          this.getDoneBehaviourSub.next(null);
        } else {
          if (val.done?.length !== 0) {
            this.getDoneBehaviourSub.next(val.done);
          }
        }
      }
    });
    return this.getDoneBehaviourSub;
  };
  myprojectSub: projectSub = {
    openeditSub: undefined
  };
  @ViewChild('drawer') public sidenav: MatSidenav;
  isClose: boolean;
  valueSelected: any;
  mainSubSections: any;
  projectName: any;
  keysselection: any;
  loggedInUid: firebase.User;
  userselectedProjectUid: firebase.User;
  removeProcess: any;
  removeDone: any
  updatedProcess: any;
  updatedDone: any;
  deviceXs: boolean;
  mediaSub: Subscription;

  constructor(public developmentservice: UserdataService, private router: Router,
    public fb: FormBuilder,
    private db: AngularFirestore,
    public afAuth: AngularFireAuth,public mediaObserver: MediaObserver,
    public dialog: MatDialog

  ) {

    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      selectedProject: string;
      mainSubSectionRef: MainSectionGroup[];
      uidDetails: firebase.User;
      userselectedProjectUid: firebase.User;
    };

    if (state !== undefined) {
      console.log(state.mainSubSectionRef);
      this.mainSubSections = state.mainSubSectionRef;
      this.projectName = state.selectedProject;
      this.loggedInUid = state.uidDetails;
      this.userselectedProjectUid = state.userselectedProjectUid;
      console.log(this.loggedInUid);
      console.log(this.mainSubSections);


    }


    this.Process= this.getProcess(this.db.doc('/taskStatusProcess/' + this.projectName ));
    this.Done= this.getDone(this.db.doc('/taskStatusDone/' + this.projectName));


console.log(this.Process);
console.log(this.Done);


    


  }
  loadTc(event) {
    this.isClose = false;
    console.log(event);
    if (!event) {
      this.isClose = true;
      console.log('dropdown is closed');
      this.valueSelected = this.myprojectControls?.subsectionkeysControl.value;
      if (this.valueSelected !== null && this.valueSelected !== undefined) {
        this.SectionTc = this.getTestcases(this.db.doc('/testcase/' + this.projectName + '/' + this.valueSelected.groupValue + '/' + this.valueSelected.value));
      }
      else {
        return of(false);
      }

    }
  }

  AddNew() {
    this.myprojectFlags.firstTestcaseEdit = true;
  }
  saveTC() {
    let locationForSave = '';
    let locationForSavepublic = '';

    const userselection = this.myprojectControls.subsectionkeysControl.value;
    console.log('userselection', userselection);

    const updateObject: TestcaseInfo = {
      heading: this.myprojectControls.createTestcaseControl.value,//Heading in testcase list
      subHeading: 'Edit SubHeading',//Sub-Heading in testcase list
      description: 'Edit here!',//Description in testcase view
      linktoTest: 'https://www.google.com/'//stackblitzLink in testcase edit/doubleclick
    };
    this.developmentservice.createNewTestcase(this.loggedInUid, updateObject, this.projectName, userselection).then(success => {
      this.myprojectFlags.firstTestcaseEdit = false;
      this.myprojectControls?.createTestcaseControl.reset();
      this.myprojectFlags.showEditTcButton = false;
    });


  }
  exitTC() {
    this.myprojectFlags.firstTestcaseEdit = false;
  }
  save(){

  }
  onNoClick(){
    this.getProcessSubscription.unsubscribe();
    this.getDoneSubscription.unsubscribe();
    this.router.navigate(['/loggedin']);



  }
  openedit() {
    let locationForEdit = '';
    let locationForEditPublic = '';

    const userselection = this.myprojectControls.subsectionkeysControl.value;
    console.log('userselection', userselection);

    const dialogRef = this.dialog.open(DialogEditTestcase, {
      width: '80vw',
      data: this.myprojectVariables.viewSelectedTestcase,
      disableClose: true
    });
    this.myprojectSub.openeditSub = dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        this.myprojectFlags.showEditTcButton = false;
        const updateObject: TestcaseInfo = { ...result };
        this.developmentservice.editTestcase(this.loggedInUid, updateObject, this.projectName, userselection, this.myprojectVariables.viewSelectedTestcase, updateObject);
        this.myprojectVariables.viewSelectedTestcase = updateObject;
        this.myprojectControls.testcaseInfoControl.setValue(`${updateObject.description}`)
      }
    });
  }
  Delete() {
    let r = confirm("Confirm Tc Delete?");
    if (r == true) {
      let locationForDelete = '';

      const userselection = this.myprojectControls.subsectionkeysControl.value;
      locationForDelete = this.projectName + '/' + userselection.groupValue + '/items/' + userselection.value;

      this.developmentservice.deleteTestcase(this.loggedInUid, this.projectName, userselection, this.myprojectVariables.viewSelectedTestcase).then(success => {
        const updateObject: TestcaseInfo = {
          heading: this.myprojectControls.createTestcaseControl.value,//Heading in testcase list
          subHeading: 'Edit SubHeading',//Sub-Heading in testcase list
          description: 'Edit here!',//Description in testcase view
          linktoTest: 'https://www.google.com/'//stackblitzLink in testcase edit/doubleclick
        };

        this.myprojectVariables.viewSelectedTestcase = updateObject;
        this.myprojectControls.testcaseInfoControl.setValue(`${updateObject.description}`);
        this.myprojectFlags.showEditTcButton = false;
      });
    } else {
      this.myprojectFlags.showEditTcButton = true;
    }
  }

  draweropen() {
  }
  drawerclose() {
    this.sidenav.close();
  }


  NavigateStart() {
    this.router.navigate(['/loggedin']);

  }
  refreshList(item: TestcaseInfo) {//When user Selects testitem by doubleclick
    console.log(item);

    this.myprojectFlags.showEditTcButton = true;
    this.myprojectVariables.viewSelectedTestcase = item;//`${item.subHeading}`;
    this.myprojectControls.testcaseInfoControl.setValue(`${item.description}`)

  }
  evenPredicate(item: CdkDrag<any>) {
    return item.data  === 0;
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return false;
  }


  
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log(event.previousContainer);
      console.log(event.container);

console.log('if');

    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
                        console.log('else');

                        this.updatedProcess=event.previousContainer.data
                        this.updatedDone=event.container.data;

                   
    }
    console.log(this.updatedProcess);
    console.log(this.updatedDone);
    console.log(event.previousIndex);
    console.log(event.currentIndex);

    






  }
  saveDone(some)
  {
if(this.updatedProcess!==undefined && this.updatedDone!==undefined){
      this.developmentservice.updatedProcessDone(this.updatedProcess,this.updatedDone,this.projectName, this.userselectedProjectUid);

    
}
  }
  ngOnInit(): void {
    this.mediaSub=this.mediaObserver.media$.subscribe((result:MediaChange)=>{
      console.log(result.mqAlias);
      this.deviceXs=result.mqAlias==='xs'?true :false;
    });
  }
}


@Component({
  selector: 'dialog-edit-testcase',
  template: `
  <h1 mat-dialog-title>Edit TestCase</h1>
  <div mat-dialog-content>
  <form [formGroup]="userProfile" fxLayout="row wrap" fxLayoutAlign="center center">
    <mat-form-field appearance="fill" floatLabel="Edit Sub-Heading" fxFlex="75vw">
      <mat-label>Change Sub-Heading</mat-label>
      <input matInput placeholder="Sub-Heading" formControlName = "subHeading">
    </mat-form-field>
    <mat-form-field appearance="fill" floatLabel="Edit Link" fxFlex="75vw">
    <mat-label>Update in Stackblitz</mat-label>
    <input matInput placeholder="Stackblitz github link" formControlName = "linktoTest">
    </mat-form-field>
    <mat-form-field appearance="fill" floatLabel="Edit Description" fxFlex="75vw">
      <mat-label>Give More Information</mat-label>

      
      <textarea 
        matInput 
        placeholder="Explain More here" 
        formControlName = "description"
        cdkTextareaAutosize
        cdkAutosizeMinRows="13"
        cdkAutosizeMaxRows="70" 
        ></textarea>
    </mat-form-field>
  </form>  
</div>
<div mat-dialog-actions>
<button mat-button mat-raised-button color="primary" [mat-dialog-close]="userProfile.value"  [disabled]="userProfile.pristine">Update</button>
  <button mat-button mat-raised-button color="warn" (click)="onNoClick()" cdkFocusInitial >Cancel</button>  
</div> `
})
export class DialogEditTestcase implements OnInit {
  userProfile: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogEditTestcase>,
    @Inject(MAT_DIALOG_DATA) public data: TestcaseInfo,
    private fb: FormBuilder) { }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  ngOnInit() {
    this.userProfile = this.fb.group({
      heading: [this.data.heading],
      subHeading: [this.data.subHeading],
      description: [this.data.description],
      linktoTest: [this.data.linktoTest]
    });


  }
}