import { AfterViewInit, Component,OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult, FirebaseuiAngularLibraryService} from 'firebaseui-angular';
import firebase from 'firebase/app';
import '@firebase/auth';

import { auth as uiAuth } from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  constructor(public afAuth: AngularFireAuth, public firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService,private db: AngularFirestore) {
    this.firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
  }
  ngAfterViewInit(): void {

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

  logout() {
    this.afAuth.signOut();
  }

  updatefirestoreNM(){
    const data = {
      stringExample: 'Hello, World!',
      booleanExample: true,
      numberExample: 3.14159265,
      dateExample: firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815')),
      arrayExample: ['hello0', 'hello'],
      nullExample: null,
      objectExample: {
        ObjarrayExample: [5, true, 'hello'],
        b: true
      }
    };
    
    const res = this.db.collection('testme').doc('one-id').set(data);
  }

  updatefirestoreMT(){
    const data = {
      stringExample: 'Merge',
      objectExample: {
        b: true
      }
    };
    
    const res = this.db.collection('testme').doc('one-id').set(data, {merge:true});
  }
  updatefirestoreMF(){
    const data = {
      stringExample: 'Merge ME False'
    };
    
    const res = this.db.collection('testme').doc('one-id').set(data, {merge:false});
  }

  MapfirestoreNM(){
    const publicdata = {
      stringExample: 'Hello, World!',
      booleanExample: true,
      numberExample: 3.14159265,
      dateExample: firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815')),
      arrayExample: [5, true, 'hello'],
      nullExample: null,
      objectExample: {
        a: 5,
        b: true
      }
    };
    
    const res = this.db.collection('testme').doc('one-id').set({publicdata});
  }

  MapfirestoreMT(){
    const publicdata = {
      stringExample: 'Merge ME'
    };
    
    const res = this.db.collection('testme').doc('one-id').set({publicdata}, {merge:true});
  }
  MapfirestoreMF(){
    const data = {
      stringExample: 'NoMerge',
      objectExample: {
        b: false
      }
    };
    
    const res = this.db.collection('testme').doc('one-id').set({data}, {merge:false});
  }
  SArrayfirestoreNM(){
   
    const res = this.db.collection('testme').doc('one-id').update(
      {arrayExample:firebase.firestore.FieldValue.arrayUnion({key: 'hello-Union'})
      });
  }

  SArrayfirestoreMT(){
    const res = this.db.collection('testme').doc('one-id').update(
      {arrayExample:firebase.firestore.FieldValue.arrayRemove({key: 'hello-Union'})
      });
  }


  ArrayfirestoreNM(){
    const data = {mydata: [{
      stringExample: 'Hello, World!',
      booleanExample: true,
      numberExample: 3.14159265,
      dateExample: firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815')),
      arrayExample: [5, true, 'hello'],
      nullExample: null,
      objectExample: {
        a: 5,
        b: true
      }
    },
    {
      stringExample: 'Hello, World!',
      booleanExample: true,
      numberExample: 3.14159265,
      dateExample: firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815')),
      arrayExample: [5, true, 'hello'],
      nullExample: null,
      objectExample: {
        a: 5,
        b: true
      }
    }
  ]};
    
    const res = this.db.collection('testme').doc('one-id').set(data);
  }

  ArrayfirestoreMT(){
    const res = this.db.collection('testme').doc('one-id').update({
      mydata:firebase.firestore.FieldValue.arrayUnion({
        stringExample: 'MergeMeeee',
        booleanExample: true,
        numberExample: 3.14159265,
        dateExample: firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815')),
        arrayExample: [5, true, 'hello'],
        nullExample: null,
        objectExample: {
          a: 5,
          b: true
        }
      })
    })
  }

  ArrayfirestoreMF(){
    const res = this.db.collection('testme').doc('one-id').update({
      mydata:firebase.firestore.FieldValue.arrayRemove({
        stringExample: 'MergeMeeee',
        booleanExample: true,
        numberExample: 3.14159265,
        dateExample: firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815')),
        arrayExample: [5, true, 'hello'],
        nullExample: null,
        objectExample: {
          a: 5,
          b: true
        }
      })
    })
  }
}
