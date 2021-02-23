import { AfterViewInit, Component,OnInit ,ChangeDetectionStrategy} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import '@firebase/auth';
import { auth as uiAuth } from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { userProfile} from './service/userdata.service';
import { BehaviorSubject, Subscription, Observable,of } from 'rxjs';
import firebase from 'firebase/app';
import { UserdataService } from './service/userdata.service';
import { map, switchMap, startWith, withLatestFrom } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  myuserProfile: userProfile = {
    userAuthenObj: null,//Receive User obj after login success
  };
  myauth;
  loggedinstate:Observable<string>=new BehaviorSubject(undefined);
  subjectauth = new BehaviorSubject(undefined);
  getObservableauthStateSub: Subscription = new Subscription;
  getObservableauthState = (authdetails: Observable<firebase.User>) => {
    if (this.getObservableauthStateSub !== undefined) {
      this.getObservableauthStateSub.unsubscribe();
    }
    this.getObservableauthStateSub = authdetails.subscribe((val: any) => {
      this.subjectauth.next(val);
    });
    return this.subjectauth;
  };
  myonline;
  subjectonline = new BehaviorSubject(undefined);
  getObservableonlineSub: Subscription = new Subscription;
  getObservableonine = (localonline: Observable<boolean>) => {
    this.getObservableonlineSub?.unsubscribe();
    this.getObservableonlineSub = localonline.subscribe((valOnline: any) => {
      this.subjectonline.next(valOnline);
    });
    return this.subjectonline;
  };
  AfterOnlineCheckAuth;



  constructor(public afAuth: AngularFireAuth,    public developmentservice: UserdataService,
    private router: Router) {
    this.myonline = this.getObservableonine(this.developmentservice.isOnline$);
    this.myauth = this.getObservableauthState(this.afAuth.authState);
    this.AfterOnlineCheckAuth = this.myonline.pipe(
      switchMap((onlineval: any) => {
        if (onlineval === true) {
          return this.myauth.pipe(
            switchMap((afterauth:firebase.User) => {
              if (afterauth !== null && afterauth !== undefined) {
                this.myuserProfile.userAuthenObj = afterauth;
                console.log(afterauth);

                this.router.navigate(['/loggedin']);
                
              }else if(afterauth === null){
                this.router.navigate(['']);
              }
              return of(onlineval);
            })
          );
        }else{
          this.router.navigate(['/offline']);          
        }
        return of(onlineval);
      })
    )
  }
  ngAfterViewInit(): void {

  }


  logout() {
    this.afAuth.signOut();
  }



}
