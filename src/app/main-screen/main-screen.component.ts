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
  @Input() Sections: Observable<any>;

  constructor(public developmentservice: UserdataService,private router: Router,    private db: AngularFirestore,
    ) { }

  ngOnInit(): void {
  }
  NavigateMain(){
    this.router.navigate(['/starttest']);

  }
}
