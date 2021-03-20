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
import { style } from '@angular/animations';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit {

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

  authDetails;
  dialogRef;
  profileRef: any;
  profileSuccessValues: usrinfoDetails;

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

            this.profileRef = this.getProfiles((this.db.doc('profile/' + myauth.uid)));
            this.profileSuccessValues = this.profileRef;
           
          } else {
            this.profileRef = this.getProfiles((this.db.doc('profile/' + myauth.uid)));
            console.log(this.profileRef);

            this.profileSuccessValues = this.profileRef;
          }
        });

        //console.log('', this.authDetails.photoURL);
      }
    });

  }

  ngOnInit(): void {
  }
  mydata;



  viewProfile() {


    this.dialogRef = this.dialog.open(ViewProfileDialog, { data: { mydata: this.profileSuccessValues , NewUid: this.authDetails},      
    height: '650px',
    width: '800px', });

    console.log('121', this.profileRef);



  }
  logout() {
    this.afAuth.signOut();
  }


}




@Component({
  selector: 'ViewProfileDialog',
  template: `

<div  style="background: white ; height:550px;     border: 3px solid #F2F3F5"
  *ngIf="this.profileRef |async as profiledetails ;"
   fxLayout="column">

  <div style="height:40%;  float:inline-start;  " class="person">
      <div id="main-card">
          <div class="cover-photo">

          </div>
          <div class="photo">
              <img src="{{profiledetails?.photoUrl}}" alt="">
          </div>
          <div class="content">
              <h4 class="name">{{profiledetails?.profileName}}</h4>
              <h4 class="name">{{profiledetails?.gender}}</h4>
              <h4 class="card__text">{{profiledetails?.areaOfinterest}}</h4>
              <h4 class="name">{{profiledetails?.skills}}</h4>
              <h4 class="name">{{profiledetails?.location}}</h4>
              <h4 class="name">{{profiledetails?.MembershipType}}</h4>
              <h4 class="name">{{profiledetails?.MembershipEnd}}</h4>


              <h6 class="email">
                  <a href="mailto:{{profiledetails?.email}}">{{profiledetails?.email}}</a>
              </h6>
          </div>
      </div>
  </div>
  <div class="">
      <h2>{{profiledetails?.membershipType}}</h2>
  </div>
  <ul class="card__info">
      <li>
          <span class="card__info__stats">{{profiledetails?.numberOfProjects}}</span>
          <span>posts</span>
      </li>
      <li>
          <span class="card__info__stats">47</span>
          <span>followers</span>
      </li>
      <li>
          <span class="card__info__stats">20</span>
          <span>following</span>
      </li>
  </ul>

  <br>

  <mat-divider></mat-divider>
  <button mat-raised-button color="primary" (click)="openBottomSheet()"
  >Edit</button>
  <button mat-raised-button color="primary" (click)="close()"
  >close</button>

  </div>





  
`,
  styles: [`
  .person {
    position: relative;
    background:white;
    width: 17rem;
    height: 20rem;
    margin: 2rem auto;
    transition: all 0.3s linear;
    border-radius: 0.3rem;
    
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  
  }
  .person img {
    border-radius: 50%;
    background:white;

    border: 0.1rem solid teal;
    width: 88px;
    height: 88px;
  }
  
  .person h4 {
    text-transform: capitalize;
    margin: 0.5rem 0;
    letter-spacing: 0.15rem;
    color: teal;
  }
  div#main-card {
    width: 600px;
  }
  
  .cover-photo {
    background: rgb(104, 175, 238);
    width: 750px;
    height: 100px;
  }
  .email{
    font-size: 16px;
    font-family: Comic Sans MS;
    padding: 15px 0;
    display: -webkit-box;
    display: -ms-flexbox;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  
  }
  
  .photo {
    background: white;
    margin: 5px;
    width: 88px;
    height: 88px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
  img {
    position: relative;
    top: -50px;
    max-width: 100%;
    max-height: 100%;

  }
  .content {
    background: white;
    width: auto;
    height: 220px;
    position: relative;
    top: -35px;
    margin-left:20px;
  }
  
  .contact {
    background: white;
    width: 280px;
    height: 50px;
    display: -webkit-box;
    display: -ms-flexbox;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
  
  h2.name,
  h3,
  a {
    margin: 0;
    text-align: center;
  }
  h3.card__text {
    margin-bottom: 0.3em;
    font-size: 1.4em;
    color: #6f6f6f;
  }
  
  a {
    color: #0ab581;
    text-decoration: none;
  }
  
  a:hover {
    color: rgb(197, 13, 13);
  }
  
  ul {
    padding: 0;
  }
  
  .fa {
    font-size: 22px;
    padding: 10px;
    text-decoration: none;
    color: #0ab581;
  }
  
  .fa:hover {
    color: rgb(38, 241, 82);
  }
        
  .container {
    position: relative;
    color: white;
  }
  .card__info {
    margin: 1em 0;
    margin-top:200px;
    background: white;
    list-style-type: none;

    padding: 0;
  }
  
  .card__info li {
    display: inline-block;
    padding: 0.5em;
  }
  
  .card__info__stats {
    color: var(--main-accent-color);
    font-weight: bold;
    font-size: 1.2em;
    display: block;
  }
  
  .card__info__stats + span {
    color: #969798;
    text-transform: uppercase;
    font-size: 0.8em;
    font-weight: bold;
  }

`
  ]

})
export class ViewProfileDialog {


  profileRef: any;
  userDetails: any;
  constructor(public developmentservice: UserdataService, private db: AngularFirestore,private _bottomSheet: MatBottomSheet
    , public dialogRef: MatDialogRef<ViewProfileDialog>, @Inject(MAT_DIALOG_DATA) public data: any) 
    
    {
    console.log(this.data);

    console.log(this.data.mydata);
    this.profileRef = this.data.mydata;
    this.userDetails=this.data.NewUid;
    

  }

  openBottomSheet(): void {

    this._bottomSheet.open(BottomSheetOverviewExampleSheet, { data: { mydata: this.profileRef,NewUid: this.userDetails } });
  }



  onNoClick(): void {
    this.dialogRef.close();
  }
  close() {
    this.dialogRef.close();
  }
  openLink(event: MouseEvent): void {
    this.dialogRef.close();
    event.preventDefault();
  }
}

@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  template: `
  <h2 class="py-4">HI {{ this.userDetails.displayName }}</h2>
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
  userDetails:any;
  constructor(public developmentservice: UserdataService, private db: AngularFirestore, private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    console.log(this.data);

    this.userDetails=data.NewUid;
    console.log(this.userDetails);

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
    this.developmentservice.updateProfile(this.names.value, this.userDetails.uid);

    console.log(this.names.value);
    console.log(this.userDetails.uid);


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

