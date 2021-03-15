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
            this.getSectionsBehaviourSub.next(val);
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
  optionsTasks: string[] = [];
  optionsTasksNamesBk: string[] = [];

  optionsTasksBk: any[] = [];
  optionsTasksSub: Subscription;
  firstProject: any;
  profileRef: any;
  userselectedProject;
  keyRef;
  DATA: projectDetails[];
  dialogRef;
  startPageUid: string;
  options: FormGroup;
  showSelected: boolean;

  toggleSearch: boolean = false;
  userProfileView;
  @ViewChild('searchbar') searchbar: ElementRef;
  activeSelector: string;

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
        this.developmentservice.findOrCreate(myauth.uid).then((success: usrinfoDetails) => {
          console.log('163', success);
          if (success === undefined) {
            const nextMonth: Date = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);

            const newItem = {

              MembershipEnd: nextMonth.toDateString(),
              MembershipType: 'Demo',
              projectLocation: '/projectList/DemoProjectKey',
              projectOwner: true,
              projectName: 'Demo',
              profileName: myauth.displayName,
              email: myauth.email,
              gender: 'pleaseEnter',
              areaOfinterest: 'pleaseEnter',
              numberOfProjects: '0',
              skills: 'pleaseEnter',
              location: 'pleaseEnter',
              photoUrl: myauth.photoURL
            };
            this.db.doc<any>('profile/' + myauth.uid).set(newItem);
            this.profileRef = this.getProfiles((this.db.doc('profile/' + myauth.uid)));

            //set- display/update
          } else {
            //get data- display/update

            this.profileRef = this.getProfiles((this.db.doc('profile/' + myauth.uid)));
            console.log(this.keyRef);
          }
        });
        this.optionsTasksSub = docData(this.db.firestore.doc('projectList/' + this.authDetails.uid)).subscribe((readrec: any) => {
          this.optionsTasks = [];
          this.optionsTasksBk = readrec.private;
          console.log('280', this.optionsTasksBk, readrec.private);
          if (this.optionsTasksBk == undefined) {

            console.log('no private projects')

          }
          else {
            readrec.private.forEach(element => {
              this.optionsTasks.push(element.projectName);
            });
            this.optionsTasksNamesBk= this.optionsTasks;
            console.log(this.optionsTasks);

          }
        });

        this.filteredTasksOptions = this.emailFormControl.valueChanges.pipe(
          startWith(''),
          map((myvalue: string) => {
            console.log('96', myvalue);
            if (myvalue === '' || myvalue === null) {
              console.log(this.authDetails.uid);

              this.privateList = this.getPrivateList(this.db.doc('projectList/' + this.authDetails.uid));

              this.optionsTasks = this.optionsTasksNamesBk;
            } else {
              this.privateList = of(this.optionsTasksBk.filter(option => option.projectName.toLowerCase().indexOf(myvalue.toLowerCase()) === 0));
              this.optionsTasks = this._filter(myvalue);
              //return this.optionsTasksBk.filter(option => option.projectName.toLowerCase().indexOf(value) === 0);
            }
          }
          )).subscribe(
            some => {

            }
          );

      }
    })
    this.optionsTasksSub = docData(this.db.firestore.doc('projectList/publicProject')).pipe(first(), map((someval: any) => {
      return someval;
    })).subscribe((readrec: any) => {
      this.optionsTasks = [];
      this.optionsTasksBk = readrec.public;

      console.log(this.obs);
      this.firstProject = { firstProjectRef: this.optionsTasksBk[0] };
      console.log(this.firstProject);
      if (this.firstProject != null) {
      }
      this.DATA = readrec.public;
      this.dataSource = new MatTableDataSource<projectDetails>(this.DATA);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
      this.changeDetectorRef.detectChanges();
      readrec.public.forEach(element => {
        this.optionsTasks.push(element.projectName);
      });
      this.optionsTasksNamesBk = this.optionsTasks;
      console.log(this.optionsTasks);
    });
    console.log(this.optionsTasks);


    this.filteredTasksOptions = this.emailFormControl.valueChanges.pipe(
      startWith(''),
      map((myvalue: string) => {
        console.log('96', myvalue);
        this.userselectedProject = undefined;
        if (myvalue === '' || myvalue === null) {
          this.optionsTasks = this.optionsTasksNamesBk;
          this.dataSource = new MatTableDataSource<projectDetails>(this.DATA);
          this.dataSource.paginator = this.paginator;
          this.obs = this.dataSource.connect();
          this.changeDetectorRef.detectChanges();
        } else {
          //this.dataSource= new MatTableDataSource<projectDetails>(this.optionsTasksBk.filter(option => option.projectName.toLowerCase().indexOf(myvalue.toLowerCase()) === 0));      
          this.obs = of(this.optionsTasksBk.filter(option => option.projectName.toLowerCase().indexOf(myvalue.toLowerCase()) === 0));
          this.optionsTasks = this._filter(myvalue);
          //return this.optionsTasksBk.filter(option => option.projectName.toLowerCase().indexOf(value) === 0);
          this.changeDetectorRef.detectChanges();
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
  sidenavtoggle() {


  }
  openSearch() {
    this.toggleSearch = true;
    this.searchbar.nativeElement.focus();
  }

  searchClose() {
    this.toggleSearch = false;
    this.emailFormControl.reset()
  }

  firstDefaultProject(some) {

    console.log('158', some.this.optionsTasks[0]);
  }

  profileKeyRef(some) {

    this.userselectedProject = some.projectName;

    this.userProfileView = some.profileName;
    console.log('242', this.userselectedProject);

    this.profileRef = this.getProfiles((this.db.doc('profile/' + some.projectUid)));
    this.getSectionsSubscription?.unsubscribe();

    this.keyRef = this.getSections((this.db.doc('projectKey/' + some.projectName)));



    console.log('218', this.keyRef);



  }

  openBottomSheet(): void {

    this._bottomSheet.open(BottomSheetOverviewExampleSheet, { data: { mydata: this.profileRef, NewUid: this.authDetails.uid } });
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


@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  template: `

    <h2 class="py-4">Edit Profile</h2>
    <form [formGroup]="names">
      <div class="form-group row">
        <label for="brand" class="col-sm-2 col-form-label">profileName</label>
        <div class="col-sm-6">
          <input type="text" class="form-control"  formControlName="profileName">
        </div>
      </div>
      <div class="form-group row">
        <label for="model" class="col-sm-2 col-form-label">email</label>
        <div class="col-sm-6">
          <input type="text" class="form-control"  formControlName="email">
        </div>
      </div>
      <div class="form-group row">
        <label for="model" class="col-sm-2 col-form-label">gender</label>
        <div class="col-sm-6">
          <input type="text" class="form-control"  formControlName="gender">
        </div>
      </div>
      <div class="form-group row">
        <label for="model" class="col-sm-2 col-form-label">areaOfinterest</label>
        <div class="col-sm-6">
          <input type="text" class="form-control"  formControlName="areaOfinterest">
        </div>
      </div>
      <div class="form-group row">
        <label for="model" class="col-sm-2 col-form-label">skills</label>
        <div class="col-sm-6">
          <input type="text" class="form-control" formControlName="skills">
        </div>
      </div>
      <div class="form-group row">
        <label for="model" class="col-sm-2 col-form-label">location</label>
        <div class="col-sm-6">
          <input type="text" class="form-control"  formControlName="location">
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-4 offset-sm-2">
          <button type="submit" class="btn btn-primary mr-2" (click)="save()">Save</button>
          <button type="reset" class="btn btn-outline-primary" (click)="cancel()">Cancel</button>
        </div>
      </div>
    </form>
  `
})
export class BottomSheetOverviewExampleSheet {

  names: FormGroup;

  constructor(public developmentservice: UserdataService, private db: AngularFirestore, private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    console.log(this.data);


    console.log('118', this.data.mydata.value);




    this.names = new FormGroup({

      profileName: new FormControl(this.data.mydata.value.profileName),
      email: new FormControl(this.data.mydata.value.email),
      gender: new FormControl(this.data.mydata.value.gender),
      areaOfinterest: new FormControl(this.data.mydata.value.areaOfinterest),
      skills: new FormControl(this.data.mydata.value.skills),
      location: new FormControl(this.data.mydata.value.location)

    });
  }


  save() {
    this.developmentservice.updateProfile(this.names.value, this.data.NewUid);

    console.log(this.names.value);
    console.log(this.data.NewUid);

    this._bottomSheetRef.dismiss();
  }

  cancel() {
    this._bottomSheetRef.dismiss();
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}

