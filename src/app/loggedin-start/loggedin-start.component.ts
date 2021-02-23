import { Component, OnInit } from '@angular/core';
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
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { startWith, take, first } from 'rxjs/operators';
import { projectControls } from '../service/userdata.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup } from '@angular/forms';
import { doc, docData } from 'rxfire/firestore';
import { combineLatest } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { NgAnalyzedFile } from '@angular/compiler';
import { Router } from '@angular/router';


@Component({
  selector: 'app-loggedin-start',
  templateUrl: './loggedin-start.component.html',
  styleUrls: ['./loggedin-start.component.scss']
})
export class LoggedinStartComponent implements OnInit {

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
  startPageUid: string;
  constructor( public firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService ,
    private router: Router,
    public fb: FormBuilder,
     public dialog: MatDialog,
      public afAuth: AngularFireAuth,
    public developmentservice: UserdataService, 
    private db: AngularFirestore) {
    this.afAuth.authState.subscribe(myauth => {
      if (myauth !== null && myauth !== undefined) {

        this.authDetails = myauth;
      }
      console.log(this.authDetails);
    })

  }

  logout() {
    this.afAuth.signOut();
  }

  NavigateNextTestCases () {
    this.router.navigate(['/main']);
  }
  NavigateNextLogOutScreen () {
    this.router.navigate(['/start']);
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

  newTaskforUser() {

    this.dialogRef = this.dialog.open(AddNewProjectDialog, { data: {   NewUid: this.authDetails } });
console.log(this.authDetails.uid );
    const createProject = this.dialogRef.afterClosed().pipe(map((values: any) => {

      const mydialog = values;

      this.developmentservice.createnewproject(mydialog, this.authDetails.uid);
      return (null);
    })).subscribe((mydata: any) => {
      //console.log('105', mydata);
      //this.developmentservice.createnewproject(mydata,this.profileinfoUid.uid);
    });
    /*const mysub = combineLatest(this.publicList, this.privateList, this.dialogRef.afterClosed()).pipe(take(1), map((values: any) => {
      const [myprivate, mypublic, mydialog] = values;
      this. updatedPublicProject= myprivate;
            this. updatedPublicProject.push({
             projectName:mydialog.projectName,
             description:mydialog.description,
             photoUrl:mydialog.photoUrl,
             projectUid:mydialog.projectUid,
             profileName:mydialog.profileName,
             creationDate:mydialog.creationDate
            });
            this. updatedPrivateProject= mypublic;
            this. updatedPrivateProject.push({
             projectName:mydialog.projectName,
             description:mydialog.description,
             photoUrl:mydialog.photoUrl,
             projectUid:mydialog.projectUid,
             profileName:mydialog.profileName,
             creationDate:mydialog.creationDate
            });
            this.developmentservice.createnewproject(this.updatedPublicProject,this.updatedPrivateProject,this.profileinfoUid.uid);
      /*
            const updatedPublic={
              projectName:mydialog.projectName,
              description:mydialog.description,
              photoUrl:mydialog.photoUrl,
              projectUid:mydialog.projectUid,
              profileName:mydialog.profileName,
              creationDate:mydialog.creationDate
             }
             console.log(updatedPublic);
      
      return (null);
    })).subscribe((mydata: any) => {
      //console.log('105', mydata);

      
      //this.developmentservice.createnewproject(mydata,this.profileinfoUid.uid);

  
    });*/

    console.log('121', this.mydata);


  }





}
@Component({
  selector: 'AddNewProjectDialog',
  template: `
  <h2 class="py-4" style="color: black; width:500px;" >EDIT PROJECT DETAILS</h2>
    <form  fxLayout="column" [formGroup]="names">
      <mat-form-field>
        <input matInput placeholder="Task Name" formControlName="projectName" />
      </mat-form-field>

      <mat-form-field>
        <textarea
          matInput
          placeholder="Task Description"
          formControlName="description"
        ></textarea>
      </mat-form-field>

      <div class="form-group row">
        <div class="col-sm-4 offset-sm-2">
          <button type="submit" class="btn btn-primary mr-2" (click)="save()">Save</button>
          <button type="reset" class="btn btn-outline-primary" (click)="cancel()">Cancel</button>
        </div>
      </div>
    </form>


    
  `
})
export class AddNewProjectDialog {

  names: FormGroup;
  createProjectFields: any;

  constructor(public developmentservice: UserdataService, private db: AngularFirestore,
    public dialogRef: MatDialogRef<AddNewProjectDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(this.data);

    console.log(this.data.NewUid);



    this.names = new FormGroup({

      projectName: new FormControl(),
      description: new FormControl(),
      creationDate: new FormControl(firebase.firestore.Timestamp.fromDate(new Date())),
      profileName: new FormControl(this.data.NewUid.displayName),
      photoUrl: new FormControl(this.data.NewUid.photoURL),
      projectUid: new FormControl(this.data.NewUid.uid),

    });


  }

  save() {

    console.log(this.names.value);


    this.dialogRef.close(this.names.value);





  }

  closeDialog() {
  }

  cancel() {
    this.names = null;
    this.dialogRef.close();

  }
  openLink(event: MouseEvent): void {
    this.dialogRef.close();
    event.preventDefault();
  }
}
  
