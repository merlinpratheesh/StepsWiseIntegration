import { Component, Input, OnInit } from '@angular/core';
import { MainSectionGroup, projectControls, projectFlags, projectVariables, TestcaseInfo, UserdataService, userProfile } from '../service/userdata.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})


export class MainScreenComponent implements OnInit {
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
      editSubsectionControl:[{ value: '' }, Validators.required]
  
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
  SectionTc ;
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
  Sections ;
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
  constructor(public developmentservice: UserdataService,private router: Router, 
    public fb: FormBuilder,   
    private db: AngularFirestore,
    
    ) {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as {
        testCaseRef: string;
        sectionRef: MainSectionGroup[];
        
      };

        if(state !== undefined){
          this.Sections=this.getSections(this.db.doc('/projectKey/'+`${state.testCaseRef}`));
          this.SectionTc= this.getTestcases(this.db.doc(`${state.testCaseRef}`+'/DefaultProject/items/Merlinpratheesh'));
          console.log(this.Sections);
          console.log(this.SectionTc);
        }
    
     }


  ngOnInit(): void {
  }
  NavigateMain(){
    this.router.navigate(['/starttest']);
  }
  refreshList(item: TestcaseInfo) {//When user Selects testitem by doubleclick
    this.myprojectFlags.showEditTcButton = true;
    this.myprojectVariables.viewSelectedTestcase = item;//`${item.subHeading}`;
    this.myprojectControls.testcaseInfoControl.setValue(`${item.description}`)
  }
}
