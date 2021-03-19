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
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit {
  authDetails;
  dialogRef;

  constructor(
    private router: Router,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public afAuth: AngularFireAuth,
    public developmentservice: UserdataService,
    private db: AngularFirestore,
    private changeDetectorRef: ChangeDetectorRef
  ) {

    this.afAuth.authState.subscribe(myauth => {
      if (myauth !== null && myauth !== undefined) {

        this.authDetails = myauth;


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
           // this.profileRef = this.getProfiles((this.db.doc('profile/' + myauth.uid)));

            //set- display/update
          } else {
console.log(success);
          }
        });

        //console.log('', this.authDetails.photoURL);
      }
    });
    
  }

      ngOnInit(): void {
    }
    mydata;

      newTaskforUser() {


      this.dialogRef = this.dialog.open(AddNewProjectDialog, { data: { NewUid: this.authDetails } });
      console.log(this.authDetails.uid);
      const createProject = this.dialogRef.afterClosed().pipe(map((values: any) => {

        console.log('390', values);
        if (values !== undefined) {
          this.developmentservice.privateProjectfindOrCreate(this.authDetails.uid).then((success: projectDetails) => {
            console.log('391', success);
            if (success === undefined) {
              const Newmydialog = values;
              this.developmentservice.createnewproject(Newmydialog, this.authDetails.uid);

              return (null);


            } else {
              //get data- display/update

              const mydialog = values;
              this.developmentservice.createnewprojectExistingId(mydialog, this.authDetails.uid);

              return (null);


            }
          });
        }



      })).subscribe((mydata: any) => {
      });
      console.log('121', this.mydata);
    }
    logout() {
      this.afAuth.signOut();
    }
  

    }
    
  @Component({
    selector: 'AddNewProjectDialog',
    template: `
  <h2 class="py-4" style="color: black; width:500px;" >ADD PROJECT DETAILS</h2>
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
    public dialogRef: MatDialogRef < AddNewProjectDialog >, @Inject(MAT_DIALOG_DATA) public data: any) {
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
  

  onNoClick(): void {
    this.dialogRef.close();
  }
  cancel() {
    this.dialogRef.close();
  }
  openLink(event: MouseEvent): void {
    this.dialogRef.close();
    event.preventDefault();
  }
}