import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ReadyToPayChangeResponse } from '@google-pay/button-angular';
import { usrinfoDetails } from '../service/userdata.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-become-member',
  templateUrl: './become-member.component.html',
  styleUrls: ['./become-member.component.scss']
})
export class BecomeMemberComponent implements OnInit {

  uid: any;
  memberUserCheck:usrinfoDetails;

  constructor(private router: Router,    private db: AngularFirestore,
    ) {

      const navigation = this.router.getCurrentNavigation();
      console.log(navigation.extras);
      const state = navigation.extras.state as {
        uid:firebase.User;
        memberUserCheck:usrinfoDetails;
      };
  

      if (state !== undefined) {

        this.uid = state.uid;
        console.log(this.uid);
       this.memberUserCheck = state.memberUserCheck
       console.log(this.memberUserCheck );

  
      }
     }

  ngOnInit(): void {
  }



NavigateStart(){
  this.router.navigate(['/loggedin']);

  }

  NewMember(){
    const nextMonth: Date = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 12);
    const newItem = {
      membershipEnd: nextMonth.toDateString(),
      membershipType: 'Member',
      memberCheck: true


    }

    this.db.doc<any>('profile/' + this.uid).set(newItem, {merge:true}).then(success=>{});
  }
}
