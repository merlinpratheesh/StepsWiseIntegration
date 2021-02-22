import { Component, OnInit } from '@angular/core';
import {FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult, FirebaseuiAngularLibraryService} from 'firebaseui-angular';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  constructor( public firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService ,
    private router: Router) { 
      this.firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
    }

  ngOnInit(): void {
  }

  NavigateNext(){
    this.router.navigate(['/main']);
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
}
