import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AfterViewInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult, FirebaseuiAngularLibraryService } from 'firebaseui-angular';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MainSectionGroup, UserdataService, projectDetails, userProfile, usrinfoDetails } from '../service/userdata.service';
import { Inject, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { startWith, take, first } from 'rxjs/operators';
import { projectControls } from '../service/userdata.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { doc, docData } from 'rxfire/firestore';
import { combineLatest } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { NgAnalyzedFile } from '@angular/compiler';
import { Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-loggedin-start',
  templateUrl: './loggedin-start.component.html',
  styleUrls: ['./loggedin-start.component.scss']
})
export class LoggedinStartComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<projectDetails>;

  myProjectDetails: projectDetails = {
    likes: 0,
    projectName: '',//Heading in testcase list
    description: '',//Sub-Heading in testcase list
    photoUrl: '',//Description in testcase view
    projectUid: '',//stackblitzLink in testcase edit/doubleclick
    creationDate: '',
    profileName: '',
  }
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
    numberOfProjects: 0,
    membershipEnd: firebase.firestore.Timestamp.fromDate(new Date())
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
  privateFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  publicSearchFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  myprojectControls: projectControls = {
    subsectionkeysControl: new FormControl(null, Validators.required),
    testcaseInfoControl: new FormControl(),
    expansionPanelControl:new FormControl(),
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
  privateList: any;
  localprivateList = [];
  getprivateListSubscription: Subscription;
  getprivateListBehaviourSub = new BehaviorSubject(null);
  getPrivateList = (privateProjects: AngularFirestoreDocument<any>) => {
    if (this.getprivateListSubscription !== undefined) {
      this.getprivateListSubscription.unsubscribe();
    }

    this.getprivateListSubscription = privateProjects.valueChanges().subscribe((val: any) => {
      console.log('61', val);

      if (val === undefined) {
        this.getprivateListBehaviourSub.next(undefined);
      } else {

        if (val.private.length === 0) {
          this.getprivateListBehaviourSub.next(null);
        } else {
          this.localprivateList = val.private;
          console.log('61', val.private);
          this.getprivateListBehaviourSub.next(val.private);
        }
      }
    });
    return this.getprivateListBehaviourSub;
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
  matcher = new MyErrorStateMatcher();

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

  myprivate: any;
  authDetails;
  publicProjectList: any;
  filteredTasksOptions: Subscription;
  optionsTasksSubPrivate: Subscription;
  optionsTasksPrivate: string[] = [];
  optionsTasksNamesBkPrivate: string[] = [];
  optionsTasksBkPrivate: any[] = [];
  optionsTasksPublic: string[] = [];
  optionsTasksNamesBkPublic: string[] = [];
  optionsTasksBkPublic: any[] = [];
  optionsTasksSubPublic: Subscription;
  firstProject: any;
  profileRef: any;
  userselectedProject;
  userselectedProjectUid;
  keyRef;
  DATA: projectDetails[];
  dialogRef;
  startPageUid: string;
  options: FormGroup;
  showSelected: boolean;
  allProjectDetails:projectDetails;
  toggleSearch: boolean = false;
  userProfileView;
  activeSelector: string;
  valueSelected: any;

  constructor(public firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService,
    private router: Router,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public afAuth: AngularFireAuth,
    public developmentservice: UserdataService,
    private db: AngularFirestore,
    private changeDetectorRef: ChangeDetectorRef,
    private _bottomSheet: MatBottomSheet) {
    this.showSelected = false;


    this.options = fb.group({
      bottom: 0,
      fixed: true,
      top: 60
    });

    this.afAuth.authState.subscribe(myauth => {
      if (myauth !== null && myauth !== undefined) {

        this.authDetails = myauth;
        console.log('', this.authDetails.uid);

        this.optionsTasksSubPrivate = docData(this.db.firestore.doc('projectList/' + this.authDetails.uid)).subscribe((readrec: any) => {
          this.optionsTasksPrivate = [];
          this.optionsTasksBkPrivate = readrec.private;
          console.log('280', this.optionsTasksBkPrivate, readrec.private);
          if (this.optionsTasksBkPrivate == undefined) {

            console.log('no private projects')

          }
          else {
            readrec.private.forEach(element => {
              this.optionsTasksPrivate.push(element.projectName);
            });
            this.optionsTasksNamesBkPrivate = this.optionsTasksPrivate;
            console.log(this.optionsTasksPrivate);

          }
        });

        this.filteredTasksOptions = this.privateFormControl.valueChanges.pipe(
          startWith(''),
          map((myvalue: string) => {
            console.log('96', myvalue);
            if (myvalue === '' || myvalue === null) {
              console.log(this.authDetails.uid);

              this.privateList = this.getPrivateList(this.db.doc('projectList/' + this.authDetails.uid));

              this.optionsTasksPrivate = this.optionsTasksNamesBkPrivate;
            } else {
              this.privateList = of(this.optionsTasksBkPrivate.filter(option => option.projectName.toLowerCase().indexOf(myvalue.toLowerCase()) === 0));
              this.optionsTasksPrivate = this._filterPrivate(myvalue);
              //return this.optionsTasksBk.filter(option => option.projectName.toLowerCase().indexOf(value) === 0);
            }
          }
          )).subscribe(
            some => {

            }
          );
          this.optionsTasksSubPublic = docData(this.db.firestore.doc('projectList/publicProject')).subscribe((readrec: any) => {
            this.optionsTasksPublic = [];
            this.optionsTasksBkPublic = readrec.public;
      
            console.log(this.optionsTasksBkPublic);
            this.firstProject = { firstProjectRef: this.optionsTasksBkPublic[0] };
            console.log(this.firstProject);
            if (this.firstProject != null) {
            }
            this.DATA = readrec.public;
            this.dataSource = new MatTableDataSource<projectDetails>(this.DATA);
            this.dataSource.paginator = this.paginator;
            this.obs = this.dataSource.connect();
            this.changeDetectorRef.detectChanges();
            readrec.public.forEach(element => {
              this.optionsTasksPublic.push(element.projectName);
            });
            this.optionsTasksNamesBkPublic = this.optionsTasksPublic;
            console.log(this.optionsTasksPublic);
          });
          console.log(this.optionsTasksPublic);
      
      
          this.filteredTasksOptions = this.publicSearchFormControl.valueChanges.pipe(
            startWith(''),
            map((myvalue: string) => {
              console.log('96', myvalue);
              this.userselectedProject = undefined;
              if (myvalue === '' || myvalue === null) {
                this.optionsTasksPublic = this.optionsTasksNamesBkPublic;
                this.dataSource = new MatTableDataSource<projectDetails>(this.DATA);
                this.dataSource.paginator = this.paginator;
                this.obs = this.dataSource.connect();
                this.changeDetectorRef.detectChanges();
              } else {
                //this.dataSource= new MatTableDataSource<projectDetails>(this.optionsTasksBk.filter(option => option.projectName.toLowerCase().indexOf(myvalue.toLowerCase()) === 0));      
                this.obs = of(this.optionsTasksBkPublic.filter(option => option.projectName.toLowerCase().indexOf(myvalue.toLowerCase()) === 0));
                this.optionsTasksPublic = this._filterPublic(myvalue);
                //return this.optionsTasksBk.filter(option => option.projectName.toLowerCase().indexOf(value) === 0);
                this.changeDetectorRef.detectChanges();
              }
            }
            )).subscribe(
              some => {
      
              }
            );

      }
    })



  }



  private _filterPrivate(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsTasksPrivate.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filterPublic(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsTasksPublic.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  sidenavtoggle() {


  }
  openSearch() {
    this.toggleSearch = true;
  }

  searchClose() {
    this.toggleSearch = false;
    this.publicSearchFormControl.reset()
  }

  firstDefaultProject(some) {

    console.log('158', some.this.optionsTasks[0]);
  }

  profileKeyRef(some) {
    this.allProjectDetails=some;
    console.log(this.allProjectDetails);

    this.userselectedProject = some.projectName;
    this.userselectedProjectUid = some.projectUid;


    this.userProfileView = some.profileName;
    console.log('242', this.userselectedProject);

    this.profileRef = this.getProfiles((this.db.doc('profile/' + some.projectUid)));
    this.getSectionsSubscription?.unsubscribe();

    this.keyRef = this.getSections((this.db.doc('projectKey/' + some.projectName)));
    console.log('218', this.keyRef);


  }


  


  logout() {
    this.afAuth.signOut();
  }

  NavigateNextTestCases() {
    this.router.navigate(['/start']);
  }
  NavigateNextLogOutScreen() {
    this.router.navigate(['/start']);
  }
  NavigateNext() {
    this.router.navigate(['/loggedin']);
  }

  InitDBNext() {

  }
  ngOnInit(): void {
  }

  addNewOpenDialog(): void {


  }
  newArray = [];
  mydata;
  updatedProject: any[] = [];


}



