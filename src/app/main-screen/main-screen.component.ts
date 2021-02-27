import { Component, Input, OnInit } from '@angular/core';
import { MainSectionGroup, UserdataService } from '../service/userdata.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent implements OnInit {
  mystartdata;
  subjectstartdata = new BehaviorSubject(undefined);
  getObservablestartdataSub: Subscription = new Subscription;
  getObservablestartdata = (localstartdata: AngularFirestoreDocument<any>) => {
    this.getObservablestartdataSub?.unsubscribe();
    this.getObservablestartdataSub = localstartdata.valueChanges().subscribe((valOnline: any) => {
      this.subjectstartdata.next(valOnline);
    });
    return this.subjectstartdata;
  };
  constructor(public developmentservice: UserdataService,private router: Router,    
    private db: AngularFirestore,
    
    ) {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as {
        testCaseRef: string;
      };
      
        if(state !== undefined){
          this.mystartdata = this.getObservablestartdata(this.db.doc('projectKey/'+ `${state.testCaseRef}`));
          console.log(this.mystartdata);
        }
    
     }

  ngOnInit(): void {
  }
  NavigateMain(){
    this.router.navigate(['/starttest']);

  }
}
