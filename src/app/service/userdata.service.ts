import { Injectable } from '@angular/core';
import { of, merge, fromEvent, Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

export interface memberDetail{
  name?:string;
  location?: string[];
  photoUrl?:string;
  birthday?:firebase.firestore.Timestamp;
  Anniversary?:firebase.firestore.Timestamp;
  linkId?:string;
}
export interface familDetails{
  GFFather:memberDetail;
  GFMother:memberDetail;
  GMFather:memberDetail;
  GMMother:memberDetail;
  Father:memberDetail;
  Mother:memberDetail;
  members:memberDetail[];

}
@Injectable({
  providedIn: 'root'
})
export class UserdataService {
  isOnline$!: Observable<boolean>;
  constructor(public auth: AngularFireAuth) { 
    this.isOnline$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(map(() => navigator.onLine));
  }
  logout() {
    console.log('reached');
    return this.auth.signOut();
  }  
}
