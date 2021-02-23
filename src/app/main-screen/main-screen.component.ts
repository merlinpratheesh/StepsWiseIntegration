import { Component, OnInit } from '@angular/core';
import { UserdataService } from '../service/userdata.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent implements OnInit {

  constructor(public developmentservice: UserdataService,private router: Router) { }

  ngOnInit(): void {
  }
  NavigateBack(){
    this.router.navigate(['/loggedin']);
  }
}
