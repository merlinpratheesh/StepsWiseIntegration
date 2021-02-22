import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { UserdataService,memberDetail,familDetails } from '../service/userdata.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-loggedin-start',
  templateUrl: './loggedin-start.component.html',
  styleUrls: ['./loggedin-start.component.scss']
})
export class LoggedinStartComponent implements OnInit {
  myfamily:familDetails={
    GFFather:undefined,
    GFMother:undefined,
    GMFather:undefined,
    GMMother:undefined,
    Father:undefined,
    Mother:undefined,
    members:undefined
  }
  startPage:memberDetail={
    name:'',
    location:[''],
    photoUrl:'',
    birthday:firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815')),
    Anniversary:firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815')),
    linkId:''
  };
  sampleGFFather:memberDetail=this.startPage;
  sampleGMFather:memberDetail=this.startPage;
  sampleGFMother:memberDetail=this.startPage;
  sampleGMMother:memberDetail=this.startPage;
  sampleFather:memberDetail=this.startPage;
  sampleMother:memberDetail=this.startPage;


  startPageUid:string;
  constructor(private db: AngularFirestore,  public developmentservice: UserdataService,public auth: AngularFireAuth,private router: Router) { 
    this.auth.authState.subscribe(myauth=>{
      if(myauth !== null){

        //this.startPageUid=myauth.uid;      
        //this.startPage.linkId= myauth.email;
        //this.startPage.name= myauth.displayName;
        //this.startPage.location=['India'];
        //this.startPage.photoUrl= myauth.photoURL;
        //this.startPage.Anniversary=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
        //this.startPage.birthday=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
  
        this.sampleGFFather.linkId= myauth.email;
        this.sampleGFFather.name= 'Grand Father';
        this.sampleGFFather.location= ['Location'];
        this.sampleGFFather.linkId= myauth.email;
        this.sampleGFFather.photoUrl='https://material.angular.io/assets/img/examples/shiba1.jpg';
        this.sampleGFFather.Anniversary=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
        this.sampleGFFather.birthday=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
  
        this.sampleGMFather.linkId= myauth.email;
        this.sampleGMFather.name= 'Grand Father';
        this.sampleGMFather.location= ['Location'];
        this.sampleGMFather.linkId= myauth.email;
        this.sampleGMFather.photoUrl='https://material.angular.io/assets/img/examples/shiba1.jpg';
        this.sampleGMFather.Anniversary=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
        this.sampleGMFather.birthday=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
  
        this.sampleGFMother.linkId= myauth.email;
        this.sampleGFMother.name= 'Grand Mother';
        this.sampleGFMother.location= ['Location'];
        this.sampleGFMother.linkId= myauth.email;
        this.sampleGFMother.photoUrl='https://material.angular.io/assets/img/examples/shiba1.jpg';
        this.sampleGFMother.Anniversary=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
        this.sampleGFMother.birthday=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
  
        this.sampleGMMother.linkId= myauth.email;
        this.sampleGMMother.name= 'Grand Mother';
        this.sampleGMMother.location= ['Location'];
        this.sampleGMMother.linkId= myauth.email;
        this.sampleGMMother.photoUrl='https://material.angular.io/assets/img/examples/shiba1.jpg';
        this.sampleGMMother.Anniversary=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
        this.sampleGMMother.birthday=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
  
        this.sampleMother.linkId= myauth.email;
        this.sampleMother.name= 'Mother';
        this.sampleMother.location= ['Location'];
        this.sampleMother.linkId= myauth.email;
        this.sampleMother.photoUrl='https://material.angular.io/assets/img/examples/shiba1.jpg';
        this.sampleMother.Anniversary=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
        this.sampleMother.birthday=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
        console.log( this.sampleFather);

        this.sampleFather.linkId= myauth.email;
        this.sampleFather.name= 'Father';
        this.sampleFather.location= ['Location'];
        this.sampleFather.linkId= myauth.email;
        this.sampleFather.photoUrl='https://material.angular.io/assets/img/examples/shiba1.jpg';
        this.sampleFather.Anniversary=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
        this.sampleFather.birthday=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
        console.log( this.sampleFather);

        this.startPage.photoUrl= myauth.photoURL;
        this.startPage.linkId= myauth.email;
        this.startPage.name= myauth.displayName;
        this.startPage.Anniversary=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
        this.startPage.birthday=firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
        this.startPage.location=['India'];
 
  
        this.myfamily.Father=this.sampleFather;
        this.myfamily.Mother=this.sampleMother;
        this.myfamily.GFFather=this.sampleGFFather;
        this.myfamily.GFMother=this.sampleGFMother;
        this.myfamily.GMFather=this.sampleGMFather;
        this.myfamily.GMMother=this.sampleGMMother;
        this.myfamily.members=[this.startPage]; 
 
      }
    });
  }

  NavigateNext(){
    this.router.navigate(['/main']);
  }
  InitDBNext(){
   
    this.db.collection('members').doc(this.startPageUid).set( this.myfamily);
  }
  ngOnInit(): void {
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
