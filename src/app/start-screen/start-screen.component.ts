import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult, FirebaseuiAngularLibraryService } from 'firebaseui-angular';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MainSectionGroup, UserdataService, projectDetails, userProfile, usrinfoDetails } from '../service/userdata.service';
import firebase from 'firebase/app';
import {  Inject, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { startWith, take, first } from 'rxjs/operators';
import { projectControls} from '../service/userdata.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { doc, docData } from 'rxfire/firestore';
import {  combineLatest } from 'rxjs';
import {  withLatestFrom } from 'rxjs/operators';
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
    projectName: '',//Heading in testcase list
    description: '',//Sub-Heading in testcase list
    photoUrl: '',//Description in testcase view
    projectUid: '',//stackblitzLink in testcase edit/doubleclick
    creationDate: '',
    profileName: '',

  }
  myuserProfile: userProfile = {
    userAuthenObj: null,//Receive User obj after login success
  };

  dialogRef;
  myprivate: any;
  authDetails;

  constructor( public firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService ,
    private router: Router,
    public fb: FormBuilder,
     public dialog: MatDialog,
      public afAuth: AngularFireAuth,
    public developmentservice: UserdataService, 
    private db: AngularFirestore,
    private _bottomSheet: MatBottomSheet,
    ) { 
      this.firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
      this.afAuth.authState.subscribe(myauth => {
        if (myauth !== null && myauth !== undefined) {
  
          this.authDetails = myauth;
        }
        console.log(this.authDetails);
      })
    }



    

  ngOnInit(): void {
  }
  logout() {
    this.afAuth.signOut();
  }

  NavigateNext(){
    this.router.navigate(['/loggedin']);
  }
  NavigateNextTestCases () {
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

