import { Component, Input, OnInit } from '@angular/core';
import { MainSectionGroup, projectControls, projectSub, projectVariables, UserdataService, userProfile } from '../service/userdata.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { docData } from 'rxfire/firestore';
@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent implements OnInit {
  myprojectVariables: projectVariables = {
    testcaseInfodata: undefined,
    testcaseslength: 0,
    publicProjectHint: '',
    publicProjectHome: undefined,
    privateTaskMainEdit: undefined,
    privateTaskSubEdit: undefined,
    viewSelectedTestcase: undefined,
    initialMainSection: undefined,
    lastSavedVisibility: false,
    modifiedKeysDb: undefined,
    editProjectkeysSaved: undefined
  } 
  myprojectSub: projectSub = {
    openeditSub: undefined,
    NewTaskControlSub: undefined,
    ownPublicprojectControlSub: undefined,
    editMainsectionGroupSub: undefined,
    editSubsectionGroupSub: undefined,
    loadFirstPageTcSub: undefined,
    loadfirstPageKeysSub: undefined,
    visibilityMainsectionGroupSub: undefined
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
      editSubsectionControl: [{ value: '' }]

    })
  };
  myuserProfile: userProfile = {
    userAuthenObj: null,//Receive User obj after login success
  };
  mystartdata;
  subjectstartdata = new BehaviorSubject(undefined);
  getObservablestartdataSub: Subscription = new Subscription;
  getObservablestartdata = (localstartdata: AngularFirestoreDocument<MainSectionGroup>) => {
    this.getObservablestartdataSub?.unsubscribe();
    this.getObservablestartdataSub = localstartdata.valueChanges().subscribe((valOnline: any) => {
      this.subjectstartdata.next(valOnline);
    });
    return this.subjectstartdata ;
  };

  SectionTc = undefined;
  getTestcasesSubscription: Subscription;
  getTestcasesBehaviourSub = new BehaviorSubject(undefined);
  getTestcases = (TestcaseList: AngularFirestoreDocument<MainSectionGroup>) => {
    if (this.getTestcasesSubscription !== undefined) {
      this.getTestcasesSubscription.unsubscribe();
    }
    this.getTestcasesSubscription = TestcaseList.valueChanges().subscribe((val: any) => {
      let arrayeverse = val;
      if (val === undefined) {
        arrayeverse = undefined;
      } else {
        if (!Object.keys(val.testcase).length === true) {
          arrayeverse = undefined;
        } else {
          if (val.testcase !== undefined) {
            arrayeverse = (val.testcase);
            this.myprojectVariables.testcaseslength = arrayeverse.length;
          } else {
            arrayeverse = undefined;
          }
        }
      }
      this.getTestcasesBehaviourSub.next(arrayeverse);
    });

    return this.getTestcasesBehaviourSub;
  };

  testcaseSub: Subscription;
  allTestCase: any;


  constructor(public developmentservice: UserdataService,private router: Router,public fb: FormBuilder,
 
    private db: AngularFirestore,
    
    ) {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as {
        testCaseRef: string;
      };
      
        if(state !== undefined){
         this.mystartdata = this.getObservablestartdata(this.db.doc('projectKey/'+ `${state.testCaseRef}`));
          console.log(this.mystartdata);
        } 

        this.testcaseSub =this.getTestcases (this.db.doc('/testcase/'+ `${state.testCaseRef}`)).subscribe((readtc: any) => {
          this.allTestCase = readtc;
          console.log(this.allTestCase);
        });

    }    


  ngOnInit(): void {
  }
  NavigateMain(){
    this.router.navigate(['/starttest']);

  }
}
