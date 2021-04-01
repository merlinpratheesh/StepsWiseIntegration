import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MainSectionGroup, projectControls, projectFlags, projectVariables, TestcaseInfo, UserdataService, userProfile } from '../service/userdata.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { map, startWith, withLatestFrom } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';




@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})



export class MainScreenComponent {


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
  @ViewChild('drawer') public sidenav: MatSidenav;
  isClose: boolean;
  valueSelected: any;
  mainSubSections: any;
  projectName:any;
  keysselection: any;
  loggedInUid: string;
  userselectedProjectUid: firebase.User;
  constructor(public developmentservice: UserdataService, private router: Router,
    public fb: FormBuilder,
    private db: AngularFirestore, public afAuth: AngularFireAuth

  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      selectedProject: string;
      mainSubSectionRef: MainSectionGroup[];
      uidDetails: string;
      userselectedProjectUid: firebase.User;

    };

    if (state !== undefined) {
      console.log(state.mainSubSectionRef);
      this.mainSubSections = state.mainSubSectionRef;
      this.projectName=state.selectedProject ;
      this.loggedInUid = state.uidDetails;
      this.userselectedProjectUid = state.userselectedProjectUid;
      console.log(this.projectName);
      console.log(this.loggedInUid);
      console.log(this.userselectedProjectUid);

    }
    this.Process= this.getProcess(this.db.doc('/taskStatusProcess/' + this.projectName ));
    this.Done= this.getDone(this.db.doc('/taskStatusDone/' + this.projectName));
    
  }


  loadTc(event) {
    console.log(this.loggedInUid);

    this.isClose = false;
    console.log(event);
    if (!event) {
      this.isClose = true;
      console.log('dropdown is closed');
      this.valueSelected = this.myprojectControls?.subsectionkeysControl.value;
      if (this.valueSelected !== null && this.valueSelected !== undefined) {
        this.SectionTc = this.getTestcases(this.db.doc('/testcase/' + this.projectName + '/' + this.valueSelected.groupValue + '/' + this.valueSelected.value));
        console.log(this.SectionTc);
      }
      else {
        return of(false);
      }

    }
  }


  draweropen() {
  }
  drawerclose() {
    this.sidenav.close();
  }


  ngOnInit(): void {
  }
  NavigateStart() {
      this.router.navigate(['/starttest']);
  }
  refreshList(item: TestcaseInfo) {//When user Selects testitem by doubleclick
    console.log(item);
    this.myprojectVariables.viewSelectedTestcase = item;//`${item.subHeading}`;
    this.myprojectControls.testcaseInfoControl.setValue(`${item.description}`)
    this.myprojectFlags.showEditTcButton = true;

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



                   
    }

  

  }
}
