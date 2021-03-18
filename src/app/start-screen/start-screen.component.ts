import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult, FirebaseuiAngularLibraryService } from 'firebaseui-angular';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MainSectionGroup, UserdataService, projectDetails, userProfile, usrinfoDetails } from '../service/userdata.service';
import firebase from 'firebase/app';
import { Inject, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { startWith, take, first } from 'rxjs/operators';
import { projectControls } from '../service/userdata.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { doc, docData } from 'rxfire/firestore';
import { combineLatest } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { NgAnalyzedFile } from '@angular/compiler';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';


@Component({
  selector: 'app-start-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  myusrinfoDetails: usrinfoDetails = {
    projectName: '',
    profileName: '',
    email: '',
    gender: '',
    areaOfinterest: '',
    skills: '',
    location: '',
    membershipType: '',
    projectLocation: '',
    photoUrl: '',
    membershipEnd: firebase.firestore.Timestamp.fromDate(new Date())
  }

  myProjectDetails: projectDetails = {
    likes:0,
    projectName: '',//Heading in testcase list
    description: '',//Sub-Heading in testcase list
    photoUrl: '',//Description in testcase view
    projectUid: '',//stackblitzLink in testcase edit/doubleclick
    creationDate: '',
    profileName: '',

  }
  myuserProfile: userProfile = {
    userAuthenObj: null,//Receive User obj after login success
    myusrinfoFromDb: null,
    keysReadFromDb: undefined,
    mainsubsectionKeys: undefined,
    subSectionKeys: undefined,
    savedMainSectionKey: undefined,
    savesubSectionKeys: undefined,
    savedisabledval: undefined
  };
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  publicList: any;
  localpublicList = [];
  getPublicListSubscription: Subscription;
  getPublicListBehaviourSub = new BehaviorSubject(undefined);
  getPublicList = (publicProjects: AngularFirestoreDocument<any>) => {
    if (this.getPublicListSubscription !== undefined) {
      this.getPublicListSubscription.unsubscribe();
    }
    this.getPublicListSubscription = publicProjects.valueChanges().subscribe((val: any) => {
      if (val === undefined) {
        this.getPublicListBehaviourSub.next(undefined);
      } else {

        if (val.public.length === 0) {
          this.getPublicListBehaviourSub.next(null);
        } else {
          this.localpublicList = val.public;
          console.log('61', val.public);
          this.getPublicListBehaviourSub.next(val.public);
        }
      }
    });
    return this.getPublicListBehaviourSub;
  };
  getProfilesSubscription: Subscription;
  getProfilesBehaviourSub = new BehaviorSubject(null);
  getProfiles = (profileDetails: AngularFirestoreDocument<usrinfoDetails>) => {
    if (this.getProfilesSubscription !== undefined) {
      this.getProfilesSubscription.unsubscribe();
    }
    this.getProfilesSubscription = profileDetails.valueChanges().subscribe((val: any) => {
      if (val === undefined) {
        this.getProfilesBehaviourSub.next(undefined);
      } else {
        this.getProfilesBehaviourSub.next(val);
      }
    }
      
    );
    return this.getProfilesBehaviourSub;
  };

Sections = of(undefined);
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

  dialogRef;
  myprivate: any;
  publicProjectList: any;
  filteredTasksOptions: Subscription;
  optionsTasks: string[] = [];
  optionsTasksNamesBk: string[] = [];
  optionsTasksBk: any[] = [];
  optionsTasksSub: Subscription;
  firstProject: any;
  profileRef: any;
  userselectedProject ;
  keyRef = this.getSections((this.db.doc('projectKey/' + 'DefaultProject')));


  constructor(public firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService,
    private router: Router,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public afAuth: AngularFireAuth,
    public developmentservice: UserdataService,
    private db: AngularFirestore,
    private _bottomSheet: MatBottomSheet,
  ) {
    this.firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
 

    this.optionsTasksSub = docData(this.db.firestore.doc('projectList/publicProject')).subscribe((readrec: any) => {
      this.optionsTasks = [];
      this.optionsTasksBk = readrec.public;
      console.log(this.optionsTasksBk);
      console.log(this.optionsTasksBk[0]);
      this.firstProject={ firstProjectRef: this.optionsTasksBk[0] };
      console.log(this.firstProject);
      if(this.firstProject!=null)
      {
        this.userselectedProject=this.firstProject.firstProjectRef.projectName;
        this.profileRef = this.getProfiles((this.db.doc('profile/' + this.firstProject.firstProjectRef.projectUid)));
        console.log(this.profileRef);

        this.keyRef = this.getSections((this.db.doc('projectKey/' + this.firstProject.firstProjectRef.projectName)));
        console.log(this.keyRef);

      }

      readrec.public.forEach(element => {
        this.optionsTasks.push(element.projectName);
      });
      this.optionsTasksNamesBk = this.optionsTasks;
      console.log(this.optionsTasks);
    });
    this.filteredTasksOptions = this.emailFormControl.valueChanges.pipe(
      startWith(''),
      map((myvalue: string) => {
        console.log('96', myvalue);
        if (myvalue === '' || myvalue === null) {
          this.publicList = this.getPublicList(this.db.doc('projectList/publicProject'));
          this.optionsTasks = this.optionsTasksNamesBk;
        } else {
          this.publicList = of(this.optionsTasksBk.filter(option => option.projectName.toLowerCase().indexOf(myvalue.toLowerCase()) === 0));
          this.optionsTasks = this._filter(myvalue);
          //return this.optionsTasksBk.filter(option => option.projectName.toLowerCase().indexOf(value) === 0);
        }
      }
      )).subscribe(
        some => {

        }
      );

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsTasks.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  firstDefaultProject(some) {

    console.log('158', some.this.optionsTasks[0]);
  }

  profileKeyRef(some){

    this.userselectedProject=some.projectName;

    console.log('216',some); 
    this.getProfilesSubscription.unsubscribe();

    this.profileRef = this.getProfiles((this.db.doc('profile/' + some.projectUid)));
    this.getSectionsSubscription?.unsubscribe();

    this.keyRef = this.getSections((this.db.doc('projectKey/' + some.projectName)));

    console.log('218',this.profileRef);
    console.log('218',this.keyRef);

   }



  ngOnInit(): void {
  }
  logout() {
    this.afAuth.signOut();
  }

  NavigateNext() {
    this.router.navigate(['/loggedin']);
  }
  NavigateNextTestCases() {
    this.router.navigate(['/main']);
  }
  successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
    console.log('successCallback', data);

  }

  errorCallback(data: FirebaseUISignInFailure) {
    console.warn('errorCallback', data);
  }

  uiShownCallback() {
    console.log('UI shown');
  }
}

