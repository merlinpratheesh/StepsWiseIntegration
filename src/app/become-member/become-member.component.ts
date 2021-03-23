import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-become-member',
  templateUrl: './become-member.component.html',
  styleUrls: ['./become-member.component.scss']
})
export class BecomeMemberComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

NavigateStart(){
  this.router.navigate(['/loggedin']);

  }

  NewMember(){
    const nextMonth: Date = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 12);
    const newItem = {
      MembershipEnd: nextMonth.toDateString(),
      MembershipType: 'Member',
      projectOwner: true
    }
   // this.db.doc<any>('myProfile/' + this.myuserProfile.userAuthenObj.uid).set(newItem, {merge:true}).then(success=>{});
  }
}
