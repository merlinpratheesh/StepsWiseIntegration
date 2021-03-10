
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult, FirebaseuiAngularLibraryService } from 'firebaseui-angular';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MainSectionGroup, UserdataService, projectDetails, userProfile, usrinfoDetails } from '../service/userdata.service';
import firebase from 'firebase/app';
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
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorStateMatcher } from '@angular/material/core';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-starttest',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './starttest.component.html',
  styleUrls: ['./starttest.component.scss'],

})
export class StarttestComponent implements OnInit,OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<projectDetails>;
  customCollapsedHeight: string = '50px';



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
  authDetails;
  publicProjectList: any;
  filteredTasksOptions: Subscription;
  optionsTasks: string[] = [];
  optionsTasksNamesBk: string[] = [];
  optionsTasksBk: any[] = [];
  optionsTasksSub: Subscription;
  firstProject: any;
  profileRef: any;
  selectedProject:any;
  mainSubSectionRef: string[] = [];

  userselectedProject ;
  keyRef ;
  DATA: projectDetails[];
  matcher = new MyErrorStateMatcher();
  toggleSearch: boolean = false;
  userProfileView;
  @ViewChild('searchbar') searchbar: ElementRef;
  options: FormGroup;
  activeSelector: string;
  showSelected: boolean;
  counter = 0;

  constructor(public firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService,
    private router: Router,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public afAuth: AngularFireAuth,
    public developmentservice: UserdataService,
    private db: AngularFirestore,
    private _bottomSheet: MatBottomSheet,
    private changeDetectorRef: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver
  ) {
    this.showSelected = false;


    this.options = fb.group({
      bottom: 0,
      fixed: true,
      top: 60
    });
    this.firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
    this.afAuth.authState.subscribe(myauth => {
      if (myauth !== null && myauth !== undefined) {
        this.authDetails = myauth;

      }
      else{

    this.optionsTasksSub = docData(this.db.firestore.doc('projectList/publicProject')).pipe(first(), map((someval:any)=>{
      return someval;
    })).subscribe((readrec: any) => {
      this.optionsTasks = [];
      this.optionsTasksBk = readrec.public;
      this.dataSource= new MatTableDataSource<projectDetails>(this.DATA);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
      console.log(this.obs);

      this.changeDetectorRef.detectChanges();
      this.firstProject={ firstProjectRef: this.optionsTasksBk[0] };
      console.log(this.firstProject);
      if(this.firstProject!=null)
      {
        //this.userselectedProject=this.firstProject.firstProjectRef.projectName;

        console.log(this.userselectedProject);
        //this.profileRef = this.getProfiles((this.db.doc('profile/' + this.firstProject.firstProjectRef.projectUid)));
        console.log(this.profileRef);

       // this.keyRef = this.getSections((this.db.doc('projectKey/' + this.firstProject.firstProjectRef.projectName)));
        console.log(this.keyRef);

      }
      this.DATA=readrec.public;
      this.dataSource= new MatTableDataSource<projectDetails>(this.DATA);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
      console.log(this.obs);
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
        this.userselectedProject= undefined;
        if (myvalue === '' || myvalue === null) {
          this.optionsTasks = this.optionsTasksNamesBk;
          this.dataSource= new MatTableDataSource<projectDetails>(this.DATA);
          this.dataSource.paginator = this.paginator;
          this.obs = this.dataSource.connect();
          this.optionsTasks = this.optionsTasksNamesBk;

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

    }})

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsTasks.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  increment() {
    this.counter++;
  }
  sidenavtoggle(){
    

  }
  openSearch() {
    this.toggleSearch = true;
    this.searchbar.nativeElement.focus();
  }

  searchClose() {
    this.toggleSearch = false;
    this.emailFormControl.reset()
  }
  ngOnInit() {

  }
  firstDefaultProject(some) {

    console.log('158', some.this.optionsTasks[0]);
  }

  profileKeyRef(some){

    this.userselectedProject=some.projectName;

    this.userProfileView=some.profileName;
    console.log('242',this.userselectedProject); 

    this.profileRef = this.getProfiles((this.db.doc('profile/' + some.projectUid)));
    this.getSectionsSubscription?.unsubscribe();

    this.keyRef = this.getSections((this.db.doc('projectKey/' + some.projectName)));

    console.log('218',this.profileRef);
    console.log('218',this.keyRef);
    

  
   }
   
   onActivated(component) {
    this.activeSelector =    this.resolver.resolveComponentFactory(component.constructor).selector;    
  }

   Expansionclose(){
    this.getSectionsSubscription?.unsubscribe();
   }

   NavigateTC(){
    this.router.navigate(['/main']);
  }


  ngOnDestroy() {


    if (this.dataSource) { 
      this.dataSource.disconnect(); 
    }
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

